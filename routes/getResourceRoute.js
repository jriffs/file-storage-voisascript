import { getResourceController } from "../controller/getResourceController.js";
import express from "express";

export const getResourceRouter = express.Router();

getResourceRouter.get('/', getResourceController)

