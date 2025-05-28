import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import executeRoutes from './execute';

const app = express();

dotenv.config();
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use('/api/v1/execute', executeRoutes);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(process.env.PORT, () => {
    console.log('Server is running on port 3000');
});