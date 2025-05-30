import express from 'express';
import redis from '../utils/redis';
import { QueueObject } from '../utils/types';
import processQueue from '../utils/queueReader';
import { addSSEConnection, removeSSEConnection } from '../utils/sse';

const router = express.Router();

router.post('/videoPrompt', async (req, res) => {
    const {userPrompt,userId,videoId} = req.body;
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

router.get('/job-events/:userId/:videoId', (req, res) => {
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