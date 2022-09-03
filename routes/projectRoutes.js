import express from 'express'
import {getProject,GetAllRowsFromProjectTable,UpdateIndividualProject} from '../controller/projectController.js'

export const projectRouter = express.Router();
// query the database for all projects
projectRouter.get("/getAllProject", GetAllRowsFromProjectTable)
// querying the database for a particular project
projectRouter.get("/:User_id", getProject);
// update an individual project
projectRouter.patch("/:opn",UpdateIndividualProject);

