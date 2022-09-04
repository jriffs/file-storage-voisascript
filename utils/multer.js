/* import multer from 'multer'

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // the directory where the files will be stored
    callback(null, __dirname + "/../files/");
  },
  filename: (req, file, callback) => {
    // attaching the generated filename to the request object so it can be accessed from the controller and stored to the database
    req.theFileName = req.body.name + Date.now() + file.fieldname + ".mp3";
    callback(null, req.body.name + Date.now() + file.fieldname + ".mp3");
  },
});

// creating an instance
export const upload = multer({ storage: storage });
 */

import multer, { memoryStorage } from "multer";
import { promisify } from 'util';

const storage = memoryStorage()

// creating an instance
const upload = multer({ storage: storage }).single('audio')
const preparedFileMiddleware = promisify(upload)

export default preparedFileMiddleware

