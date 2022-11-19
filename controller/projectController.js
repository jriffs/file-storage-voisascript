import { request } from "express"
import { getAll, getOneProjectByUser, UpdateProject, createNewProject} from "../model/db.js"
import getBearer from "../utils/getBearerToken.js";
import { authenticate } from "../utils/communicateWithAuth.js";

export async function createProjectController(req, res) {
    const userData = await checkUser(req, res)
    const {Project_Name, Project_Desc} = req.body
    if (!Project_Name || !Project_Desc) {
        return res.sendStatus(400)
    }
    const result = await createNewProject({
        User_ID: userData.userID,
        Project_Name: Project_Name,
        Project_Desc: Project_Desc
    })
    if (result.error) return res.status(400).send(result)
    return res.status(200).send(result)
}

export async function updateProjectController(req, res) {
    const userData = await checkUser(req, res)
    const {New_Project_Name, New_Project_Desc, Project_ID} = req.body
    if (!New_Project_Name || !New_Project_Desc || !Project_ID) {
        return res.sendStatus(400)
    }
    const result = await UpdateProject({
        Project_ID: Project_ID,
        Project_Desc: New_Project_Desc,
        User_ID: userData.userID,
        NewProjectName: New_Project_Name
    })
    if (result.error) return res.status(400).send(result)
    return res.status(200).send(result)
}


async function checkUser(request, response) {
    const Bearer = getBearer(request)
    const somn = await authenticate(Bearer)
    if (somn.error) {
        return response.status(400).send(somn.error)
    }
    if (somn.isUser === false) {
        return response.sendStatus(403)
    }
    return somn.userData
}

