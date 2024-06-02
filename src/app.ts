import express from 'express';
import { Worker, QueueEvents, Queue } from 'bullmq';
import connection from './config/redis';
import { uploadImage } from './controllers/uploadController';
import processImage from './Jobs/imageProcessor';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up routes
app.use('/api', require('./routes').default);

// Set up Bull-Board
const serverAdapter = new ExpressAdapter();
const imageQueue = new Queue('imageQueue', { connection });

createBullBoard({
  queues: [new BullMQAdapter(imageQueue)],
  serverAdapter: serverAdapter,
});

serverAdapter.setBasePath('/admin/queues');
app.use('/admin/queues', serverAdapter.getRouter());

// Initialize the worker
const worker = new Worker('imageQueue', processImage, {
  connection,
  limiter: {
    max: 10,
    duration: 1000,
  },
});

worker.on('completed', job => {
  console.log(`Job ${job.id} completed!`);
});

worker.on('failed', (job, err) => {
    if(job){
        console.error(`Job ${job.id} failed with error: ${err.message}`);
    }else{
        console.error(`A job failed with error: ${err.message}`);
    }
  
});

const queueEvents = new QueueEvents('imageQueue', { connection });

queueEvents.on('failed', ({ jobId, failedReason }) => {
  console.error(`Job ${jobId} failed with reason: ${failedReason}`);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
