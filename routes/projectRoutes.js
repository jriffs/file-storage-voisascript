import express from 'express'
import {GetIndividualUser,GetAllRowsFromProjectTable} from '../controller/projectController.js'

export const projectRouter = express.Router();
// query the database for all projects
projectRouter.get("/getAllProject", GetAllRowsFromProjectTable)
// querying the database for a particular project
projectRouter.get("/:id", GetIndividualUser);


