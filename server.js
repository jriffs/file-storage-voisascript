import express from 'express';
import { routes } from './routes/routes.js'
import connectdb from './model/db.js'
import { getAll } from './model/db.js';

const app = express();
const {projectRoute, fileRoute} = routes

// json parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

const port = process.env.PORT || 5000;

// database connection 
connectdb()


// router for all the project endpoint
app.use("/project", projectRoute);
// router for all the files endpoint
app.use("/files", fileRoute);

app.listen(port, () => {
  console.log(`listening at port ${port}`);
});
