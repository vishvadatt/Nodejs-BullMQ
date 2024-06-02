import express from 'express';
import { ExpressAdapter } from '@bull-board/express'
import { createBullBoard } from '@bull-board/api'
import { BullMQAdapter} from '@bull-board/api/bullMQAdapter'
import { Queue } from 'bullmq'
import connection from './config/redis';
import router from './routes';

const app = express();
const port =3000;

app.use(express.json());
app.use(express.urlencoded({ extended : true }));

app.use('/api', router);

// new code
const serverAdapter = new ExpressAdapter();
const imageQueue = new Queue('imageQueue' , { connection });

createBullBoard({
    queues: [new BullMQAdapter(imageQueue)],
    serverAdapter : serverAdapter
});

// old code
// define the BullMQ queue
// const queueName = 'myQueue';
// const myQueue = new Queue(queueName, {connection});
// set up Bull-Board
// const serverAdapter = new ExpressAdapter();
// createBullBoard({
//     queues: [new BullMQAdapter(myQueue)],
//     serverAdapter : serverAdapter
// });

serverAdapter.setBasePath('/admin/queues');

app.use('/admin/queues',serverAdapter.getRouter());

// Basic route to test the server
app.get('/',(req,res) => {
    res.send('Hello BullMQ with Typescript and Express!')
})

app.listen(port,() => {
    console.log(`Server is running on http://localhost:${port}`);
})