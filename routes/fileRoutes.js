<<<<<<< HEAD
import express from "express";
import uploadController from "../controller/uploadController.js";
import upload from "../utils/multer.js";
=======
import express from 'express'
import uploadController from '../controller/uploadController.js'
>>>>>>> 45c4fc07f1a59e4159282223a35141f596e648e4

export const fileRouter = express.Router();
// uploading a file
fileRouter.post("/upload", uploadController);


<<<<<<< HEAD
export default fileRouter;
=======
>>>>>>> 45c4fc07f1a59e4159282223a35141f596e648e4
