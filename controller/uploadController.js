import { preparedFileMiddleware } from "../utils/multer.js";
import { uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getFileRefference} from "../utils/firebase-fileStorage.js";
import { createNewFile, createNewProject, getOneFile, getOneProjectByUser, UpdateFileURL } from "../model/db.js";
import { authenticate } from "../utils/communicateWithAuth.js";
import { constructData } from "../utils/construct-data.js";
import { Events } from "../utils/events.js";

export async function uploadController(req, res) {
  const Bearer = getBearer(req)
  const somn = await authenticate(Bearer)
  const { isUser, userData } = somn
  if (isUser === false) {
    return res.sendStatus(403)
  }
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file!" })
    }
    if (!req.body.project && !req.body.newProjectName) {
      return res.status(400).send({ message: "Please choose a project!" })
    }
    const project = req.body?.project,
    newProjectDesc = req.body?.newProjectDesc,
    newProjectName = req.body?.newProjectName,
    projectName = project?.split('~')[0],
    projectID = project?.split('~')[1],
    storageRef = getFileRefference(`@${userData?.username}/projects/${projectName ?? newProjectName}/${req.file.originalname}`)
    if (projectName) {
      const result = await createNewFile({
        User_ID: userData.userId,
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
        const newProject = await getOneProjectByUser(null, userData.userId, projectName)
        if (newProject.error) return res.status(400).send(newProject)
        const {id} = newProject[0]
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
        const result = await UpdateFileURL({
          Project_ID: id,
          File_Name: req.file.originalname,
          User_ID: userData.userId,
          fileURL: downloadURL
        })
        if (result.error) {
          return res.status(400).send(result)
        }
        const constructedURL = `http://localhost:5000/files/url?filename=${req.file.originalname}`
        const { finalProjectsArr, projectStat, finalFilesArr, fileStat} = await constructData(userData.userId)
        res.status(200).json({
          url: constructedURL,
          userId: userData.userId,
          username: userData.username,
          projects: finalProjectsArr,
          files: finalFilesArr,
          stats: {
            projects: projectStat,
            files: fileStat
          } 
        })
      }
    }
    if(newProjectName){
      const result1 = await createNewProject({
        User_ID: userData.userId,
        Project_Name: newProjectName,
        Project_Desc: newProjectDesc
      })
      if (result1.error) return res.status(400).send(result1)
      const newProject = await getOneProjectByUser(null, userData.userId, newProjectName)
      if (newProject.error) return res.status(400).send(newProject)
      const {id} = newProject[0]
      const uploadTask = uploadBytesResumable(storageRef, req.file.buffer, req.file.mimetype)
      uploadTask.on('state_changed', {
        error: (error) => {
          return res.status(401).send(error.code)
        },
        complete: () => {
          console.log('file Uploaded successfully')
          Events.emit('upload-event-sucess', func)
        }
      })
      const func = async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
        const result2 = await createNewFile({
          User_ID: userData.userId,
          File_Name: req.file.originalname,
          fileURL: downloadURL,
          Project_ID: id
        })
        if (result2.error) return res.status(400).send(result2)
        const constructedURL = `http://localhost:5000/files/url?filename=${req.file.originalname}`
        const { finalProjectsArr, projectStat, finalFilesArr, fileStat} = await constructData(userData.userId)
        res.status(200).json({
          url: constructedURL,
          userId: userData.userId,
          username: userData.username,
          projects: finalProjectsArr,
          files: finalFilesArr,
          stats: {
            projects: projectStat,
            files: fileStat
          } 
        })
      }
    }
    
  } catch (err) {
    console.log(err)
    res.status(400).send(err)
  }
}

export async function getMainFileURL(req, res) {
  const Bearer = getBearer(req)
  const somn = await authenticate(Bearer)
  const { isUser } = somn
  if (isUser === false) {
    return res.sendStatus(403)
  }
  if (req.query.filename) {
    console.log(req.query.filename)
    const fileName = req.query.filename
    getOneFile(fileName, (err, result) => {
      if (err) {
        return res.status(400).json({ message: err })
      }
      res.send(result[0].File_URL)
    })
  }
}

function getBearer(NetworkRequest) {
  const authType = NetworkRequest?.headers?.authorization?.split(' ')[0]
  if (authType === 'Bearer') {
    return NetworkRequest?.headers?.authorization.split(' ')[1]
  }
}