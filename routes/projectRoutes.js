import express from 'express'
import {getProject,GetAllRowsFromProjectTable,UpdateIndividualUser} from '../controller/projectController.js'

export const projectRouter = express.Router();
// query the database for all projects
projectRouter.get("/getAllProject", GetAllRowsFromProjectTable)
// querying the database for a particular project
projectRouter.get("/:User_id", getProject);
// update an individual project
projectRouter.patch("/:id",UpdateIndividualUser);

