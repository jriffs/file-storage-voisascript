import express from 'express'
import { createProjectController, updateProjectController } from '../controller/projectController.js'

export const projectRouter = express.Router();
// creating a new project
projectRouter.post("/create", createProjectController)
// Upadting a project
projectRouter.put("/update", updateProjectController)
// querying the database for a particular project
// projectRouter.get("/:User_id", getProject);
// update an individual project
// projectRouter.patch("/:opn", UpdateIndividualProject);

