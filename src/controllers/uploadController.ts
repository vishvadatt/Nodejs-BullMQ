import {Request, Response} from 'express';
import multer from 'multer';
import { Queue } from 'bullmq';
import connection from '../config/redis';
import { fileURLToPath } from 'url';

// const upload = multer({ dest : 'uploads/'});

const queueName = 'imageQueue';
const imageQueue = new Queue(queueName, {connection});

const uploadImage = [
    // upload.single('image'),
    async(req:Request, res:Response) => {
        if(!req.file){
            return res.status(400).send("No File Uploaded.");
        }

        await imageQueue.add('processImage', { fileURLToPath : req.file.path},{
            attempts : 3, // Retry up to 3 times
            backoff : {
                type : 'fixed', // Fixed delay between retries
                delay : 5000    // 5 seconds delay
            }
        });
        res.send("Image uploaded and processing started..")
    }
]

export { uploadImage}