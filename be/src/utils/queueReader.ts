import {
    GenerateContentResult,
    GoogleGenerativeAI,
} from "@google/generative-ai";
import { Redis } from "@upstash/redis";
import { exec } from "child_process";
import * as fs from "fs/promises";
import * as path from "path";
import { promisify } from "util";
import getPrompt from '../utils/prompt';
import { supabase } from '../utils/supabase';
import { QueueObject } from "./types";


let isProcessing = false;
let shouldContinueProcessing = true;

const execAsync = promisify(exec);

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Extract Python code from LLM response
function extractPythonCode(llmResponse: string): string | null {
    const match = llmResponse.match(/```python([\s\S]*?)```/);
    return match ? match[1].trim() : null;
}

// Basic code checks
function isCodeSafe(code: string): boolean {
    const bannedPatterns = [/import\s+os/, /import\s+sys/, /subprocess/, /open\s*\(/];
    return !bannedPatterns.some((pattern) => pattern.test(code));
}


export default async function processQueue() {
    if (isProcessing) {
        return;
    }
    isProcessing = true;
    try {
        while (shouldContinueProcessing) {
            const promptDetails: QueueObject = (await redis.rpop(
                "prompts"
            )) as any;
            try {
                if (!promptDetails) {
                    break;
                }
                const d = new Date();
                let seconds = d.getSeconds();
                const GEMINI_API = process.env[`GEMINI_API_KEY_${Math.ceil(seconds / 15)}`];
                const genAI = new GoogleGenerativeAI(GEMINI_API!);
                const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
                const prompt = getPrompt(promptDetails.userPrompt);
                try {
                    const result: GenerateContentResult = await model.generateContent(
                        prompt
                    );
                    const text = result.response.candidates?.[0].content.parts[0].text!;
                    const pythonCode = extractPythonCode(text);
                    if (!pythonCode) {
                        console.error("No valid Python code found in LLM response.");
                        return;
                    }

                    if (!isCodeSafe(pythonCode)) {
                        console.error("The extracted code contains unsafe patterns. Aborting.");
                        return;
                    }

                    const inputDir = path.join(process.cwd(), `manim_input/${promptDetails.userId}-${promptDetails.videoId}`);
                    const outputDir = path.join(process.cwd(), `manim_output/${promptDetails.userId}-${promptDetails.videoId}`);

                    await fs.mkdir(inputDir, { recursive: true });
                    await fs.mkdir(outputDir, { recursive: true });

                    const inputFilePath = path.join(inputDir, "temp.py");
                    await fs.writeFile(inputFilePath, pythonCode);

                    try {
                        const dockerCommand = [
                            "docker run --rm -i",
                            `-v "${inputDir}:/manim_input:ro"`,
                            `-v "${outputDir}:/manim_output"`,
                            `-v "${process.cwd()}/script.sh:/script.sh:ro"`,
                            "--network=none",
                            "--memory=512m --cpus=1",
                            `--user ${1}:${2}`,
                            "manimcommunity/manim",
                            "bash /script.sh"
                        ].join(" ");


                        const { stderr } = await execAsync(dockerCommand);
                        if (stderr) console.error("Docker errors:", stderr);
                        // Check if Temp.mp4 was created
                        const finalVideoPath = path.join(outputDir, "Temp.mp4");
                        try {
                            await fs.access(finalVideoPath);
                            // Upload input Python file
                            const inputFileBuffer = await fs.readFile(inputFilePath);
                            const { error: inputError } = await supabase.storage
                                .from('manim-bolt')
                                .upload(`${promptDetails.userId}/${promptDetails.videoId}/temp.py`, inputFileBuffer, {
                                    contentType: 'text/plain',
                                    upsert: true
                                });

                            if (inputError) {
                                console.error('Error uploading input file:', inputError);
                                throw inputError;
                            }

                            // Upload output video file
                            const videoFileBuffer = await fs.readFile(finalVideoPath);
                            const { error: videoError } = await supabase.storage
                                .from('manim-bolt')
                                .upload(`${promptDetails.userId}/${promptDetails.videoId}/temp.mp4`, videoFileBuffer, {
                                    contentType: 'video/mp4',
                                    upsert: true
                                });

                            if (videoError) {
                                console.error('Error uploading video file:', videoError);
                                throw videoError;
                            }

                            // Get a signed URL for the video file (valid for 1 hour)
                            const { data: signedUrlData, error: signedUrlError } = await supabase.storage
                                .from('manim-bolt')
                                .createSignedUrl(`${promptDetails.userId}/${promptDetails.videoId}/temp.mp4`, 3600); // 3600 seconds = 1 hour

                            if (signedUrlError) {
                                console.error('Error getting signed URL:', signedUrlError);
                                throw signedUrlError;
                            }

                            // Delete input and output files
                            await fs.rm(inputDir, { recursive: true, force: true });
                            await fs.rm(outputDir, { recursive: true, force: true });

                        } catch {
                            console.error("Temp.mp4 not found after Docker run.");
                        }
                    } catch (err) {
                        console.error("Error running Docker:", err);
                    }

                } catch (error) {
                    console.error("Error processing item:", error);
                }
            } catch (error) {
                console.log(error);
            }
        }
    } catch (error) {
        console.error("Fatal error in queue processor:", error);
    } finally {
        isProcessing = false;
    }
}

export function stopProcessing() {
    shouldContinueProcessing = false;
}