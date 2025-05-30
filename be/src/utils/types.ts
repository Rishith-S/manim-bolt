export interface QueueObject {
  userId:string;
  videoId: string;
  userPrompt: string;
  failureAttempts: number;
  delayBeforeTrials : number;
}

export interface Result {
  status:string;
  errormessage?:string;
  videoUrl?: string;
  pythonCode?: string;
}
  