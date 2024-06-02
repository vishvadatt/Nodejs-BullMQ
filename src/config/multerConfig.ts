import multer from 'multer';
import { v4 as uuidv4} from 'uuid';
import path from 'path';
import fs from 'fs';

// Create a storage directory if it doesn't exist
const createDirectories = (dir:string) => {
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir, {recursive : true});
    }
}

const storage = multer.diskStorage({
    destination : (req,file, cb) => {
        const uploadPath = path.join(__dirname,'..','uploads',
            new Date().getFullYear().toString(),
            (new Date().getMonth() + 1).toString().padStart(2,'0'),
            new Date().getDate().toString().padStart(2,'0')
        );
        createDirectories(uploadPath);
        cb(null,uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName)
    }
});

const upload = multer({storage});

export default upload;