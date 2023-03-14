import {fileRouter} from './fileRoutes.js'
import {projectRouter} from './projectRoutes.js';
import { getResourceRouter } from './getResourceRoute.js';
// import { workerRouter } from "./worker-test-route.js";


export const routes = {
  fileRoute: fileRouter,
  projectRoute: projectRouter,
  getResource: getResourceRouter,
  // workerRouter: workerRouter
}
