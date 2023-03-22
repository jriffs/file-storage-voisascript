// import { UpdateProject, DeleteProject, deleteAllFileUnderProject} from "../model/db.js"
import { DatabaseAdmin } from "../model/db-admin.js";
import getBearer from "../utils/getBearerToken.js";
import { authenticate } from "../utils/communicateWithAuth.js";
import { constructData, FinalConstructData } from "../utils/construct-data.js";
import { deleteObject, listAll, list} from "firebase/storage";
import { getFileRefference} from "../utils/firebase-fileStorage.js";
import { my_Flow, my_Queue } from "../utils/general-queue.js";
import { v4 } from "uuid";
import Redis from "redis"
// import env from 'dotenv'

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


// const redisOptions = { host: 'localhost', port: '6379' }

/* const my_Queue = {
    testQueue: new Queue('test', {connection: redisOptions})
}
const my_Flow = {
    testFlow: new FlowProducer()
} */

export async function createProjectController(req, res) {
    try {
        const id = `${v4()}`
        const userData = await checkUser(req, res)
        console.log(userData)
        if (userData.error) return
        const {Project_Name, Project_Desc} = req.body, user_id = userData.data.userID
        // const job = await my_Queue.testQueue.add("create-project", {Project_Name, Project_Desc, userData}, {removeOnComplete: true})
        const flow = await my_Flow.create_project_flow.add({
            name: "create-project",
            queueName: "create-project-parent",
            children: [
                {
                    name: "create-project-sub",
                    queueName: "create-project-children",
                    data: {Project_Name, Project_Desc, userData, id}
                }
            ]},
            {
                queuesOptions: {
                  "create-project-parent": {
                    defaultJobOptions: {
                      removeOnComplete: true,
                      attempts: 3,
                      backoff: {
                        type: "exponential",
                        delay: 2000
                      }
                    }
                  },
                  "create-project-children": {
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
        return res.status(200).send({status: 'pending', resource_ID: id}) 
    } catch (error) {
        console.log(error)
        return res.status(405).send({error: `Internal Server Error`})
    }
}

export async function updateProjectController(req, res) {
    try {
        const userData = await checkUser(req, res)
        if (userData.error) return res.status(400).send({error: `Network Request Parameters Missing`})
        const {New_Project_Name, New_Project_Desc, Project_ID} = req.body
        if (!New_Project_Name || !New_Project_Desc || !Project_ID) {
            return res.status(400).send({error: 'some fields missing'})
        }
        const DB = new DatabaseAdmin()
        const result = await DB.UpdateProject({
            Project_ID: Project_ID,
            Project_Desc: New_Project_Desc,
            User_ID: userData.data.userID,
            NewProjectName: New_Project_Name
        })
        if (result.error) return res.status(400).send(result)
        const Data = await FinalConstructData(userData?.data.userID, userData.data.username, null, userData.userToken)
        return res.status(200).send(Data)
    } catch (error) {
        return res.status(405).send({error: `Internal Server Error`})
    }
}

export async function deleteProjectController(req, res) {
    try {
        const userData = await checkUser(req, res)
        if (userData.error) return
        const {Project_ID} = req.body
        if (!Project_ID) return res.status(400).send({error: 'Incomplete fields'})
        const projectReff = getFileRefference(`@${userData?.data.username}/projects`)
        const {prefixes} = await list(projectReff)
        // res.status(200).send(userData.data.userID)
        const DB = new DatabaseAdmin()
        if (prefixes.length == 0) {
            
            const result = await DB.DeleteProject({
                id: Project_ID,
                User_ID: userData.data.userID
            })
            if (result.error) return res.status(400).send(result)
            const Data = await FinalConstructData(userData?.data.userID, userData.data.username, null, userData.userToken)
            return res.status(200).send(Data)
        }
        const projectPathArray = []
        prefixes.forEach(project => {
            const path = project.fullPath
            projectPathArray.push(path)
        })
        const check_if_project_exist = check_If_Project(projectPathArray, Project_ID)
        if (check_if_project_exist.error) return res.status(400).send(check.error)
        if (check_if_project_exist == true) {
            // deleting all the files under that project from the cloud
            const fileReff = getFileRefference(`@${userData?.data.username}/projects/${Project_ID}`)
            let {items} = await listAll(fileReff)
            items.forEach(item => {
                deleteObject(getFileRefference(item.fullPath)).then(() => {
                    console.log('file deleted successfully')
                    return
                }).catch((error) => {
                    console.log(error)
                    return
                })
            })
            // deleting all the files under that project from the database
            const result1 = await DB.deleteAllFileUnderProject(Project_ID)
            if (result1.error) {
                res.status(400).send({error: 'An unexpected Error came up'})
                return
            }
            // deleting the project from the database

            const result2 = await DB.DeleteProject({
                id: Project_ID,
                User_ID: userData.data.userID
            })
            if (result2.error) {
                res.status(400).send({error: 'An unexpected Error came up'})
                return
            }
            // return DATA after success
            const Data = await FinalConstructData(userData?.data.userID, userData.data.username, null, userData.userToken)
            return res.status(200).send(Data)
        }
    } catch (error) {
        return res.status(400).send(error)
    }
}

export async function getUserProjects(req, res) {
    if (req.headers['originator'] === 'auth') {
        const userID = req.params.userID
        if (userID) {
            const data = await constructData(userID)
            return res.send(data) 
        } 
    }
}

 export async function checkUser(request, response) {
    const Bearer = getBearer(request)
    console.log(`at check user - ${Bearer}`)
    const somn = await authenticate(Bearer)
    if (somn.error) {
        console.log(somn.error)
        response.status(400).send({error: `${somn.error}`, at: `checkUser - authenticate`})
        return {error: somn.error}
    }
    if (somn.isUser === false) {
        response.status(400).send({error: 'Unauthorized User !!'})
        return {error: somn.error}
    }
    return {data: somn.userData, userToken: Bearer}
}

function check_If_Project(projectPathArray, project) {
    if (!projectPathArray) {
        return {error: 'Invalid Array'}
    }
    const projectNameArray = []
    projectPathArray.forEach(projectPath => {
        projectNameArray.push(projectPath.split('/')[2]) 
    })
    const check = projectNameArray.find(projectName => projectName = project)
    if (!check) return false
    return true
}

