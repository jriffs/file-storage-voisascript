import express from 'express'
import { createProjectController, deleteProjectController, getUserProjects, updateProjectController,  } from '../controller/projectController.js'

export const projectRouter = express.Router();
// creating a new project
projectRouter.post("/create", createProjectController)
// Upadting a project
projectRouter.put("/update", updateProjectController)
// Deleting Project
projectRouter.delete('/delete', deleteProjectController)
// getting all the projects for a particular user
projectRouter.get('/:userID', getUserProjects)


