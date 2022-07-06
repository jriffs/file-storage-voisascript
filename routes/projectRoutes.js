const projectController = require("../controller/projectController");

module.exports = function (router) {
  // querying the database for a particular project
  router.get("/:id", projectController);
};
