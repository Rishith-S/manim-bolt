import express from 'express';
import redis from '../utils/redis';
import { QueueObject } from '../utils/types';

const router = express.Router();

router.post('/videoPrompt', async (req, res) => {
    const {userPrompt,userId,videoId} = req.body;
    const queueObject : QueueObject = {
        userId,
        videoId,
        userPrompt
    }
    await redis.lpush("prompts", queueObject);
});

export default router;