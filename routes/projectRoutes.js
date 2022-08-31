import express from 'express'
import projectController from '../controller/projectController.js'

export const projectRouter = express.Router();
// querying the database for a particular project
projectRouter.get("/:id", projectController);


