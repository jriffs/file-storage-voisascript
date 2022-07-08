const express = require("express");
const projectController = require("../controller/projectController");

const projectRouter = express.Router();
// querying the database for a particular project
projectRouter.get("/:id", projectController);

module.exports = projectRouter;
