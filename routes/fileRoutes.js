import express from 'express'
import {uploadController, getMainFileURL} from '../controller/uploadController.js'
export const fileRouter = express.Router();
// uploading a file
fileRouter.post("/upload", uploadController);

fileRouter.get('/:projectID/url', getMainFileURL)
