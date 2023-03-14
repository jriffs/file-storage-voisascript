import Redis from 'redis'
import { checkUser } from './filesController.js'
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

export async function getResourceController(req, res) {
    try {
      const userData = await checkUser(req, res)
      if (!userData || userData.error) return
      const {resource_ID} = req.query
      if (!resource_ID) {
        return res.status(400).send({error: "no resource ID"})
      }
      const exists = await redisClient.hExists(resource_ID, "status")
      if (exists == false) {
        console.log("No resource with that resource ID")
        return res.status(400).send({error: "No resource with that resource ID"})
      }
      if (await redisClient.hGet(resource_ID, "status") == "failed") {
        console.log("Unfortunately Your Task failed, please try again")
        return res.status(200).send({error: "Unfortunately Your Task failed, please try again"})
      }
      if (await redisClient.hGet(resource_ID, "status") == "pending") {
        console.log("Task is still running, checkback later")
        return res.status(200).send({update: "Task is still running, checkback later"})
      }
      const data = await redisClient.hGet(resource_ID, "data")
      return res.status(200).send(data)
    } catch (e) {
      return res.status(500).send({error: e})
    }
}