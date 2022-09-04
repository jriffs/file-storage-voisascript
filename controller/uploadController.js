import preparedFileMiddleware from "../utils/multer";

export default function uploadController(req, res){
  // sending the generated file name
  // this controller will handle storing the file name to the data base
  res.send(req.theFileName);
};


