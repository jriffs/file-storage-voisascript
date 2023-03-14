import { Queue, FlowProducer } from "bullmq";
import IORedis from "ioredis"
// import env from "dotenv";

// env.config()

const connection = new IORedis(process.env.REDISCLOUD_URL)

export const my_Queue = {
    create_file_queue: new Queue("create-file", { connection }),
    construct_data_queue: new Queue("construct-data", { connection })
}

my_Queue.create_file_queue.on("error", (err) => {
    console.log(`first queue error is: ${err}`)
})

my_Queue.construct_data_queue.on("error", (err) => {
    console.log(`second queue error is: ${err}`)
})

export const my_Flow = {
    create_project_flow: new FlowProducer({ connection }),
    create_file_flow: new FlowProducer({ connection })
}