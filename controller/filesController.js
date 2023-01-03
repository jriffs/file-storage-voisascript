import { preparedFileMiddleware } from "../utils/multer.js";
import { uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { getFileRefference} from "../utils/firebase-fileStorage.js";
import { createNewFile, createNewProject, getOneFile, getOneProjectByUser, UpdateFileURL } from "../model/db.js";
import { authenticate } from "../utils/communicateWithAuth.js";
import { FinalConstructData } from "../utils/construct-data.js";
import { Events } from "../utils/events.js";
import getBearer from "../utils/getBearerToken.js";

export async function uploadController(req, res) {
  const userData = await checkUser(req, res)
  if (!userData || userData.error) return
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file!" })
    }
    if (!req.body.project) {
      return res.status(400).send({ message: "Please choose a project!" })
    }
    const project = req.body?.project,
    projectName = project?.split('~')[0],
    projectID = project?.split('~')[1],
    storageRef = getFileRefference(`@${userData?.data?.username}/projects/${projectID}/${req.file.originalname}`)
    if (projectName && projectID) {
      const result = await createNewFile({
        User_ID: userData?.data?.userID,
        File_Name: req.file.originalname,
        fileURL: '',
        Project_ID: projectID
      })
      if (result?.error) {
        return res.send({error: `${result.error}`, occured: 'At creating new file'})
      }
      const uploadTask = uploadBytesResumable(storageRef, req.file.buffer, req.file.mimetype)
      uploadTask.on('state_changed', {
        error: (error) => {
          return res.status(400).send(error.code)
        },
        complete: () => {
          console.log('file Uploaded successfully')
          Events.emit('upload-event-sucess', func)  
        }
      })
      const func = async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
        const result = await UpdateFileURL({
          Project_ID: projectID,
          File_Name: req.file.originalname,
          User_ID: userData?.data?.userID,
          fileURL: downloadURL
        })
        if (result.error) {
          return res.status(400).send(result)
        }
        const constructedURL = `http://localhost:5000/files/${projectID}/url?filename=${req.file.originalname}`
        const Data = await FinalConstructData(userData?.data?.userID, userData?.data?.username, constructedURL, userData.userToken)
        return res.status(200).json(Data)
      }
    }
    
  } catch (err) {
    return res.status(400).send(err)
  }
}

export async function deleteFileController(req, res) {
  
}

export async function getMainFileURL(req, res) {
  const Bearer = getBearer(req)
  const somn = await authenticate(Bearer)
  const { isUser } = somn
  if (isUser === false) {
    return res.sendStatus(403)
  }
  if (!req.query.filename) {
    return res.status(400).send('incorrect url')
  }
  if (!req.params.projectID) {
    return res.status(400).send('incorrect url')
  }
  const fileName = req.query.filename
  const projectID = req.params.projectID
  const result = await getOneFile(null, projectID, fileName)
  if (result.error) {
    return res.status(400).json({ message: err })
  }
  res.status(200).send(result[0].File_URL)
}

async function checkUser(request, response) {
  const Bearer = getBearer(request)
  const somn = await authenticate(Bearer)
  if (somn.error) {
      response.status(400).send({error: `${somn.error}`})
      return {error: somn.error}
  }
  if (somn.isUser === false) {
      response.status(400).send({error: 'Unauthorized User !!'})
      return {error: somn.error}
  }
  return {data: somn.userData, userToken: Bearer}
}

