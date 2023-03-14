import express from 'express';
import { routes } from './routes/routes.js'
import cors from "cors"
// import connectdb from './model/db.js'
import { preparedFileMiddleware } from "./utils/multer.js";

const app = express();
const {projectRoute, fileRoute, getResource, workerRouter} = routes

// json parser
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(preparedFileMiddleware)
// app.use(localBodyParser) // use when req.body is empty
/* app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, originator, authorization")
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE")
  next()
}) */

const port = process.env.PORT || 5000;

// database connection 
// connectdb()


// router for all the project endpoint
app.use("/projects", projectRoute);
// router for all the files endpoint
app.use("/files", fileRoute);

app.use("/task", getResource)

// app.use("/testing", workerRouter)

app.listen(port, () => {
  console.log(`listening at port ${port}`);
});
