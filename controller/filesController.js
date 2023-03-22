// import { preparedFileMiddleware } from "../utils/multer.js";
import { deleteObject } from "firebase/storage";
import { getFileRefference } from "../utils/firebase-fileStorage.js";
// import { DeleteFile, getOneFile } from "../model/db.js";
import { authenticate } from "../utils/communicateWithAuth.js";
import { FinalConstructData } from "../utils/construct-data.js";
import { DatabaseAdmin } from "../model/db-admin.js";
import getBearer from "../utils/getBearerToken.js";
import { v4 } from "uuid";
import { my_Flow } from "../utils/general-queue.js";
import Redis from "redis"
// import env from "dotenv";

// env.config()


const redisClient = Redis.createClient({
  password: process.env.REDIS_DB_PASS,
  socket: {
      host: 'redis-14244.c265.us-east-1-2.ec2.cloud.redislabs.com',
      port: 14244
  },
  username: "Admin_user"
})
await redisClient.connect()

/* export async function uploadController(req, res) {
  const id = `${v4()}`
  const userData = await checkUser(req, res)
  if (!userData || userData.error) return
  try {
    const project = req.body?.project,
    projectName = project?.split('~')[0],
    projectID = project?.split('~')[1], 
    {file} = req,
    job = await my_Queue.create_file_queue.add("file-upload", 
    {projectName, projectID, userData, file, id}, 
    {
      removeOnComplete: true, 
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000
      }
    })
    return res.status(200).json({status: "pending", resource_ID: id})
  } catch (err) {
    return res.status(400).send(err)
  }
} */

export async function uploadController(req, res) {
  const id = `${v4()}`
  const userData = await checkUser(req, res)
  if (!userData || userData.error) return
  try {
    const project = req.body?.project,
      projectName = project?.split('~')[0],
      projectID = project?.split('~')[1],
      { file } = req
    const flow = await my_Flow.create_project_flow.add({
      name: "construct-data",
      queueName: "construct-data",
      children: [
        {
          name: "create-file-db",
          queueName: "create-file",
          children: [
            {
              name: "file-upload",
              queueName: "create-file",
              data: { projectName, projectID, userData, file, id }
            }
          ]
        }
      ]
    },
      {
        queuesOptions: {
          "create-file": {
            defaultJobOptions: {
              removeOnComplete: true,
              attempts: 3,
              backoff: {
                type: "exponential",
                delay: 2000
              }
            }
          },
          "construct-data": {
            defaultJobOptions: {
              removeOnComplete: true,
              attempts: 3,
              backoff: {
                type: "exponential",
                delay: 1000
              }
            }
          }
        }
      })
    await redisClient.hSet(`${id}`, "status", "pending")
    return res.status(200).json({ status: "pending", resource_ID: id })
  } catch (error) {
    return res.status(503).send({ error: `An error occuired while creating the file: ${error}` })
  }
}

export async function deleteFileController(req, res) {
  const userData = await checkUser(req, res)
  if (!userData || userData.error) return
  try {
    if (!req.body.file_ID && !req.body.project_ID, !req.body.file_Name) {
      return res.status(400).send({ message: "No file Chosen !!" })
    }
    const { file_ID, project_ID, file_Name } = req.body
    const fileReff = getFileRefference(`@${userData?.data.username}/projects/${project_ID}/${file_Name}`)
    deleteObject(fileReff).then(() => {
      console.log('single file deleted successfully')
    }).catch((error) => {
      console.log(error)
      return
    })
    const DB = new DatabaseAdmin()
    const result = await DB.DeleteFile({
      id: file_ID,
      Project_ID: project_ID
    })
    if (result.error) return res.status(400).send(result.error)
    const Data = await FinalConstructData(userData?.data?.userID, userData?.data?.username, null, userData.userToken)
    return res.status(200).json(Data)
  } catch (error) {
    return res.status(400).send(err)
  }
}

export async function getMainFileURL(req, res) {
  try {
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
    const DB = new DatabaseAdmin()
    const result = await DB.getOneFile(null, projectID, fileName)
    console.log(result)
    if (result.error) {
      return res.status(400).json({ message: result.error })
    }
    console.log(result[0])
    console.log(result[0]?.File_URL)
    res.status(200).send(result[0]?.File_URL)
  } catch (error) {
    return res.status(400).json({ message: error })
  }
}

export async function checkUser(request, response) {
  const Bearer = getBearer(request)
  const somn = await authenticate(Bearer)
  if (somn.error) {
    response.status(400).send({ error: `${somn.error}` })
    return { error: somn.error }
  }
  if (somn.isUser === false) {
    response.status(400).send({ error: 'Unauthorized User !!' })
    return { error: somn.error }
  }
  return { data: somn.userData, userToken: Bearer }
}

