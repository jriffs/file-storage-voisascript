import { Queue, FlowProducer } from "bullmq";
import Redis from "redis";

const redisClient = Redis.createClient()
await redisClient.connect()

const redisOptions = { host: 'localhost', port: '6379' }

const my_Queue = {
    testQueue: new Queue('test', {connection: redisOptions}),
    flowQueue_1: new Queue('flow-1', {connection: redisOptions}),
    flowQueue_2: new Queue('flow-2', {connection: redisOptions})
}

const my_Flow = new FlowProducer()

export async function workerFunction(req, res) {
    try {
        if (req.body) {
            const flow = await my_Flow.add({
                name: "first-flow",
                queueName: "teacher",
                children: [
                    {name: "student-1", queueName: "student", data: {course: "Biology"}},
                    {name: "student-2", queueName: "student", data: {course: "Chemistry"}},
                    {name: "student-3", queueName: "student", data: {course: "Physics"}}
                ]
            }) 
            return res.status(200).send({status: 'pending', retry: 2000, data: null, id: `${flow.job.name}-${flow.job.id}`})
        } 
    } catch (e) {
        return res.status(200).send({error: e})
    }
}

export async function TestingQueueLifecycle(req, res) {
    try {
        if (req) {
            const failQueue = await my_Queue.flowQueue_1.add("fail-test", {count: req.body.count}, 
            {removeOnComplete: true, attempts: 3, backoff: {type: "fixed", delay: 1000}})
            return res.send({status: `Request has triggered a ${failQueue.name} queue job`})
        }
    } catch (error) {
        return res.send({error})
    }
}

export async function getWorkerResult(req, res) {
    try {
        const {job_id} = req.params
        if (!job_id) return res.status(400).send({error: "please specify job ID"})
        const exists = await redisClient.exists(`${job_id}`)
        if (exists != 1) return res.status(400).send({error: "no such job"})
        const data = await redisClient.get(job_id)
        return res.status(200).send({data})
    } catch (e) {
        
    }
}