import express from "express";
import projectController from "../controller/projectController.js";

const projectRouter = express.Router();
// querying the database for a particular project
projectRouter.get("/:id", projectController);

export default projectRouter;
