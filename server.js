import express from "express";
import { projectRouter, fileRouter } from "./routes/routes.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 5000;

// router for all the project endpoint
app.use("/project", projectRouter);
// router for all the files endpoint
app.use("/files", fileRouter);

app.listen(port, () => {
  console.log(`listening at port ${port}`);
});
