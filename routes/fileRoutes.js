import express from 'express'
import uploadController from '../controller/uploadController.js'

export const fileRouter = express.Router();
// uploading a file
fileRouter.post("/upload", uploadController);


