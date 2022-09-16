<<<<<<< HEAD
import express from "express";
import projectController from "../controller/projectController.js";
=======
import express from 'express'
import {getProject,GetAllRowsFromProjectTable,UpdateIndividualProject} from '../controller/projectController.js'
>>>>>>> 45c4fc07f1a59e4159282223a35141f596e648e4

export const projectRouter = express.Router();
// query the database for all projects
projectRouter.get("/getAllProject", GetAllRowsFromProjectTable)
// querying the database for a particular project
projectRouter.get("/:User_id", getProject);
// update an individual project
projectRouter.patch("/:opn",UpdateIndividualProject);

<<<<<<< HEAD
export default projectRouter;
=======
>>>>>>> 45c4fc07f1a59e4159282223a35141f596e648e4
