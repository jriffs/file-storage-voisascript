const express = require("express");
const uploadController = require("../controller/uploadController");
const upload = require("../utils/multer");

const fileRouter = express.Router();
// uploading a file
fileRouter.post("/upload", upload.single("image"), uploadController);

module.exports = fileRouter;
