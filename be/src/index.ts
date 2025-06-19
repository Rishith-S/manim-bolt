import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './utils/routes/auth';
import chatHistoryRouter from './utils/routes/chatHistory';
import executeRouter from './utils/routes/execute';

const app = express();

dotenv.config();
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/chatHistory', chatHistoryRouter);
app.use('/api/v1/execute', executeRouter);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(process.env.PORT, () => {
    console.log('Server is running on port 3000');
});