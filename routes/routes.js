const fileRouter = require("./fileRoutes");
const projectRouter = require("./projectRoutes");

const routes = {
  fileRoute: fileRouter,
  projectRoute: projectRouter,
};

module.exports = routes;
