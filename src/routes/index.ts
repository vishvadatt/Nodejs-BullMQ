import express,{Request, Response} from "express";
// import { uploadImage } from '../controllers/uploadController';
import { Queue, Job } from "bullmq";
import connection from "../config/redis";
import multer from "multer";
import upload from "../config/multerConfig";
import { fileURLToPath } from "url";

const router = express.Router();
const queueName = 'imageQueue';
const imageQueue = new Queue(queueName, { connection });

router.post('/upload', upload.single('image'), async (req:Request,res:Response) => {
    if(!req.file){
        return res.status(400).send("No file uploaded")
    }

    await imageQueue.add('uploadProcessImage',{fileURLToPath : req.file.path})

    res.send("Image uploaded and processing started..")
});

router.post('/retry-failed', async (req,res) => {
    const failedJobs : Job[] = await imageQueue.getFailed();
    const promises = failedJobs.map(job => job.retry());
    await Promise.all(promises);
    res.send('Retrying all failed jobs')
});

// Route to clean all failed jobs
router.post('/clean-failed' ,async (req,res) => {
    const cleanJobs = await imageQueue.clean(0,0,'failed');
    res.send(`Cleaned ${cleanJobs.length} failed jobs`)
});


export default router;