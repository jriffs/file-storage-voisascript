import { Queue, FlowProducer } from "bullmq";

const redisOptions = { host: 'localhost', port: '6379' }

export const my_Queue = {
    create_file_queue: new Queue("create-file", {connection: redisOptions}),
    construct_data_queue: new Queue("construct-data", {connection: redisOptions})
}

export const my_Flow = {
    create_project_flow: new FlowProducer(),
    create_file_flow: new FlowProducer()
}