import multer from 'multer';
import {fileURLToPath} from 'url';
import {dirname, join} from 'path';
import {v4 as uuidv4} from 'uuid';

const currentFileURL = import.meta.url;
const currentFilePath =  fileURLToPath(currentFileURL);
const currentDirPath = dirname(currentFilePath);

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const imgFolderPath = join(currentDirPath, '..', 'public', 'img')
        cb(null, imgFolderPath);
    },
    filename: function(req, file, cb) {
        const filename = uuidv4();
        cb(null, filename);
    }
});

export const uploader = multer({storage});
