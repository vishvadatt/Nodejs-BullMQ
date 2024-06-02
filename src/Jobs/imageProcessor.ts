import sharp from 'sharp'
import {Job} from 'bullmq'
import fs from 'fs'
import path from 'path';

const processImage =  async (job:Job) => {
    console.log("JOB...+++++++++++++++", job.data);
    
    const { fileURLToPath } = job.data;
    const outputFilePath = fileURLToPath.replace(/(\.\w+)$/, '-processed$1');
    
    // console.log(fileURLToPath);
    // const outputfileURLToPath = path.join(path.dirname(fileURLToPath),`resized_${path.basename(fileURLToPath)}`);
    await sharp(fileURLToPath)
    .resize(800, 800)
    // .toFile(outputFilePath)

    return { outputFilePath };
};

export default processImage;