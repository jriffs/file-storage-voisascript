import express from 'express'
import uploadController from '../controller/uploadController.js'
import {upload} from '../utils/multer.js'

export const fileRouter = express.Router();
// uploading a file
fileRouter.post("/upload", upload.single("audio"), uploadController);


