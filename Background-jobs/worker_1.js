import { Worker } from 'bullmq'
import { Queue } from "bullmq"
import Redis from "redis";
// import { createNewProject, createNewFile } from "./db.js";
import { DatabaseAdmin } from "./db-administrator.js";
import { FinalConstructData } from "./construct-data.js";
import { getFileRefference } from '../utils/firebase-fileStorage.js';
import { uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import IORedis from "ioredis"
// import env from "dotenv";

// env.config()

const connection = new IORedis(process.env.REDISCLOUD_URL)

const my_Queue = {
    testQueue: new Queue('test', { connection })
}

/* const worker_1 = new Worker("test", worker_1_Handler, {connection: redisOptions})
const worker_2 = new Worker("teacher", worker_2_Handler, {connection: redisOptions})
const worker_3 = new Worker("student", worker_3_Handler, {connection: redisOptions}) */
const create_Project_Parent_Worker = new Worker("create-project-parent", create_Project_Parent_handler, { connection })
const create_Project_Children_Worker = new Worker("create-project-children", create_Project_Children_handler, { connection })
const create_File_Worker = new Worker("create-file", create_File_Handler, { connection })
const construct_Data_Worker = new Worker("construct-data", construct_Data_Handler, { connection })

const redisClient = Redis.createClient({
    password: process.env.REDIS_DB_PASS,
    socket: {
        host: 'redis-14244.c265.us-east-1-2.ec2.cloud.redislabs.com',
        port: 14244
    },
    username: "Admin_user"
})
await redisClient.connect()

/* const worker_1 = new Worker("flow-1", worker_1_Handler, {connection: redisOptions})
worker_1.on("failed", (job)=> {
    if (job.attemptsMade == 3) {
        console.log("job has reached its final attempt")
        console.log(job.data.somn)
    }
})
worker_1.on("completed", (job)=> {
    console.log(`${job.name} has completed...`)
})
async function worker_1_Handler(job) {
    switch (job.name) {
        case "fail-test":
            console.log("fail test job started")
            let count = parseInt(job.data.count)
            if (count % 3 == 0) return
            job.data.somn = "something"
            throw new Error("count is not divisible by 3")
        default: console.log(job.name)
            break;
    }
} */

/* async function worker_2_Handler(job) {
    if (job.name == "first-flow") {
        console.log(job.name)
    }
    const childrenValues = Object.values(await job.getChildrenValues())
    console.log(childrenValues) 
}

async function worker_3_Handler(job) {
    // console.log(job.name)
    if (job.name == "student-1") {
        return job.data
    } else if (job.name == "student-2") {
        return job.data
    } else {
        return job.data
    }
} */

create_Project_Children_Worker.on("failed", async (job) => {
    if (job.attemptsMade == 3) {
        console.log(`${job.name} has reached its final attempt`)
        await redisClient.hSet(`${job.data.resource_ID}`, "status", "failed")
    }
})
create_Project_Parent_Worker.on("failed", async (job) => {
    if (job.attemptsMade == 3) {
        console.log(`${job.name} has reached its final attempt`)
        await redisClient.hSet(`${job.data.resource_ID}`, "status", "failed")
    }
})

async function create_Project_Parent_handler(job) {
    try {
        if (job.name == "create-project") {
            // console.log(job.name)
            const childrenValues = Object.values(await job.getChildrenValues())
            const Children_Result = childrenValues[0]
            // console.log(result)
            const { userData, result, id } = Children_Result
            if (result.error) {
                job.data.resource_ID = id
                throw new Error(`${result.error}`)
            }
            if (result.success) {
                const Data = await FinalConstructData(userData?.data.userID, userData.data.username, null, userData.userToken)
                await redisClient.hSet(`${id}`, "status", "success")
                await redisClient.hSet(`${id}`, "data", JSON.stringify(Data))
            }
        }
    } catch (error) {
        console.error(error)
    }
}

async function create_Project_Children_handler(job) {
    try {
        if (job.name == "create-project-sub") {
            // console.log(job.name)
            const { Project_Name, Project_Desc, userData, id } = job.data
            const DB = new DatabaseAdmin()
            const result = await DB.createNewProject({
                User_ID: userData?.data.userID,
                Project_Desc,
                Project_Name
            })
            console.log(result)
            if (result?.error) {
                job.data.resource_ID = id
                const error = new Error(result.error)
                throw error
            } else {
                return { userData, result, id }
            }
            // return {message: "some message"}
        }
    } catch (error) {
        console.error(error)
    }
}

create_File_Worker.on("failed", async (job) => {
    if (job.attemptsMade == 3) {
        console.log(`${job.name} has reached its final attempt`)
        await redisClient.hSet(`${job.data.resource_ID}`, "status", "failed")
    }
})

construct_Data_Worker.on("failed", async (job) => {
    if (job.attemptsMade == 3) {
        console.log(`${job.name} has reached its final attempt`)
        await redisClient.hSet(`${job.data.resource_ID}`, "status", "failed")
    }
})

/* create_File_Worker.on("completed", async (job)=> {
    console.log(`${job.name} is completed`)
})*/

async function create_File_Handler(job) {
    try {
        switch (job.name) {
            case "file-upload":
                console.log('file-upload job started')
                const { projectName, projectID, userData, file, id } = job.data
                file.buffer = Buffer.from(file.buffer)
                const storageRef = getFileRefference(`@${userData?.data?.username}/projects/${projectID}/${file.originalname}`)
                const uploadTask = uploadBytesResumable(storageRef, file.buffer, file.mimetype)
                const downloadURL = await new Promise((resolve, reject) => {
                    uploadTask.on('state_changed', {
                        error: async (error) => {
                            job.data.resource_ID = id
                            const err = new Error(`Error uploading file ...${error}`)
                            reject(err)
                        },
                        complete: async () => {
                            console.log("file uploaded successfully...")
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
                            resolve(downloadURL)
                        }
                    })
                })
                console.log(`downloadURL is: ${downloadURL}`)
                return { projectName, projectID, userData, id, downloadURL, filename: file.originalname }
                break;
            case "create-file-db":
                const childrenValues = await job.getChildrenValues(),
                JobData = Object.values(childrenValues)
                // console.log(JobData[0].filename)
                const DB = new DatabaseAdmin() 
                const result = await DB.createNewFile({
                    User_ID: JobData[0].userData?.data?.userID,
                    File_Name: JobData[0].filename,
                    fileURL: JobData[0].downloadURL,
                    Project_ID: JobData[0].projectID
                })
                if (result?.success) {
                    console.log("file created successfully ...")
                    return {
                        projectID: JobData[0].projectID,
                        downloadURL: JobData[0].downloadURL,
                        id: JobData[0].id,
                        userData: JobData[0].userData,
                        filename: JobData[0].filename
                    }
                } else {
                    const childrenValues = await job.getChildrenValues(),
                    JobData = Object.values(childrenValues)
                    job.data.resource_ID = JobData[0].id
                    console.log(result.error)
                    throw new Error(`${result.error}`)
                }
                break;
            default: console.log(job.name)
                break;
        }
        return
    } catch (error) {
        const childrenValues = await job.getChildrenValues(),
            JobData = Object.values(childrenValues)
        job.data.resource_ID = JobData[0].id
        throw error
    }
}

async function construct_Data_Handler(job) {
    console.log(`${job.name} has started...`)
    try {
        const childrenValues = await job.getChildrenValues(),
            JobData = Object.values(childrenValues)
        const constructedURL = `https://voisascript-file-storage.herokuapp.com/files/${JobData[0].projectID}/url?filename=${JobData[0].filename}`
        const Data = await FinalConstructData(JobData[0].userData?.data?.userID, JobData[0].userData?.data?.username, constructedURL, JobData[0].userData.userToken)
        await redisClient.hSet(`${JobData[0].id}`, "status", "success")
        await redisClient.hSet(`${JobData[0].id}`, "data", JSON.stringify(Data))
    } catch (error) {
        const childrenValues = await job.getChildrenValues(),
            JobData = Object.values(childrenValues)
        job.data.resource_ID = JobData[0].id
        throw new Error(`${error}`)
    }
}

console.log("worker has started...")