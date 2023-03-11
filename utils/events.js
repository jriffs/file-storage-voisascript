import { EventEmitter } from "events";
import { my_Queue } from "./general-queue.js";

export const Events = new EventEmitter()

Events.on('upload-event-sucess', (target) => {
    if (typeof target !== 'function') {
        throw new Error('target parameter must be a function')
    }
    target()
})

/* Events.on("firebase-file-upload-complete", async ({projectName, projectID, userData, file, id, downloadURL}) => {
    const job = await my_Queue.create_file_queue.add("create-file-db",
        {projectName, projectID, userData, file, id, downloadURL}, 
        {removeOnComplete: true}
    )
    console.log(`${job.name} job initiated with job id -> ${job.id}`)
}) */

Events.on("construct-data", async ({userData, projectID, file, id}) => {
    const job = await my_Queue.construct_data_queue.add("construct-data", {userData, projectID, file, id}, {removeOnComplete: true})
    console.log(`${job.name} job initiated with job id -> ${job.id}`)
})


// Events.emit('upload-event', somn, 'this is it')