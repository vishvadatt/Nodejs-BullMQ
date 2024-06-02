import {Queue} from 'bullmq'
import connection from './config/redis'

const queueName = 'myQueue';
const myQueue = new Queue(queueName,{connection});

// Add a job to the queue
(async () =>{
    await myQueue.add('myjob',{foo : 'bar'});
    console.log('Job added to the Queue');
    
})();

    