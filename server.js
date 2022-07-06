const express = require("express");
const multer = require("multer");
const projectController = require("./controller/projectController");
const uploadController = require("./controller/uploadController");
const app = express();

app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // the directory where the files will be stored
    callback(null, __dirname + "/files/");
  },
  filename: (req, file, callback) => {
    // attaching the generated filename to the request object so it can be accessed from the controller and stored to the database
    req.theFileName = req.body.name + Date.now() + file.fieldname + ".jpg";
    callback(null, req.body.name + Date.now() + file.fieldname + ".jpg");
  },
});

// creating an instance
const upload = multer({ storage: storage });

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`listening at port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello world");
});

// router for all the project endpoint
const projectRouter = express.Router();
// router for all the file endpoint
const fileRouter = express.Router();

// querying the database for a particular project
projectRouter.get("/:id", projectController);
// uploading a file
fileRouter.post("/upload", upload.single("image"), uploadController);

app.use("/projects", projectRouter);
app.use("/files", fileRouter);
