const uploadController = require("../controller/uploadController");
const upload = require("../utils/multer");

module.exports = function (router) {
  // uploading a file
  router.post("/upload", upload.single("image"), uploadController);
};
