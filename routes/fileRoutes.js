import express from 'express'
import {uploadController, getMainFileURL, deleteFileController} from '../controller/filesController.js'
export const fileRouter = express.Router();
// uploading a file
fileRouter.post("/upload", uploadController);

fileRouter.get('/:projectID/url', getMainFileURL)

fileRouter.delete('/delete', deleteFileController)
