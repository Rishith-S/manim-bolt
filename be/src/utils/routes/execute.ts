import express from 'express';
import redis from '../redis';
import { QueueObject } from '../types';
import processQueue from '../queueReader';
import { addSSEConnection, removeSSEConnection } from '../sse';
import allowCredentials from '../../middleware/allowCredentials';
import prisma from '../prisma';

const router = express.Router();

router.post('/getVideoId', allowCredentials, async (req, res) => {
    const { userId } = req.body;
    const videoId = await prisma.video.findMany({
        where: {
            userId,
        },
    });
    res.status(200).json({ 'videoId': videoId.length+1 });
    return;
});

router.post('/videoPrompt', allowCredentials, async (req, res) => {
    const {userPrompt,userId,videoId,type} = req.body;
    const queueObject : QueueObject = {
        userId,
        videoId,
        userPrompt,
        failureAttempts: 3,
        delayBeforeTrials: 2
    }
    await redis.lpush("prompts", queueObject);
    processQueue();
    res.status(200).json({ 'message': 'result' });
    return;
});

router.get('/job-events/:userId/:videoId', allowCredentials,(req, res) => {
    const { videoId, userId } = req.params;
    // Set SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    });
  
    // Send initial connection message
    res.write('data: {"status": "connected"}\n\n');
  
    // Add this connection to our tracking
    addSSEConnection(userId, videoId, res);
  
    // Handle client disconnect
    req.on('close', () => {
      console.log("close")
      removeSSEConnection(userId, videoId, res);
      res.end();
    });
  });
  

export default router;