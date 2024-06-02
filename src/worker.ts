import {Worker, QueueEvents, Job} from 'bullmq';
import connection from './config/redis';
import { error } from 'console';
import processImage from './Jobs/imageProcessor';


// new code
const queueName = 'imageQueue'
const worker = new Worker(queueName, processImage, { 
    connection,

    limiter : {
        max  : 10,
        duration : 1000
    },
});


// old code
// const queueName = 'myQueue';
// create a worker to process jobs from the queue
// const worker = new Worker(queueName,async (job:Job) => {
//     console.log(`Processing job #${job.id} with data: `,job.data);
//     return {
//         result : "Job completed successfully"
//     }
// },{connection});

// Handle job completion
worker.on('completed',job => {
    console.log(`Job #${job.id} has been completed`)
});

// Handle job failures
worker.on('failed',(job,err) => {
    console.log(`Job ${job?.id} has failed with error: `,err)
})

// Create a queue scheduler to manage job retries and delayed jobs
const queueEvents  = new QueueEvents(queueName, {connection});

queueEvents .on('failed',({jobId, failedReason}) => {
    console.error(`Job ${jobId} failed with reason: ${failedReason}`);
})