import preparedFileMiddleware from "../utils/multer";

export default function uploadController(req, res){
  // sending the generated file name
  // this controller will handle storing the file name to the data base
  res.send(req.theFileName);
};

<<<<<<< HEAD
export default uploadController;
=======

>>>>>>> 45c4fc07f1a59e4159282223a35141f596e648e4
