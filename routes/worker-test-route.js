import { workerFunction, getWorkerResult, TestingQueueLifecycle } from "../controller/worker-test-controller.js"
import express from 'express'
export const workerRouter = express.Router()

workerRouter.post('/hello-world', workerFunction)
workerRouter.get("/:job_id", getWorkerResult)
workerRouter.get("/", TestingQueueLifecycle)