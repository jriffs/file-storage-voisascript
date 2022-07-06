const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 5000;

// router for all the project endpoint
const projectRouter = express.Router();
app.use("/projects", projectRouter);
require("./routes/projectRoutes")(projectRouter);

// router for all the file endpoint
const fileRouter = express.Router();
app.use("/files", fileRouter);
require("./routes/fileRoutes")(fileRouter);

app.listen(port, () => {
  console.log(`listening at port ${port}`);
});
