import { getAll, getOneProjectByUser, UpdateProject, createNewProject, DeleteProject, deleteAllFileUnderProject} from "../model/db.js"
import getBearer from "../utils/getBearerToken.js";
import { authenticate } from "../utils/communicateWithAuth.js";
import { constructData, FinalConstructData } from "../utils/construct-data.js";
import { deleteObject, listAll, list} from "firebase/storage";
import { getFileRefference} from "../utils/firebase-fileStorage.js";

export async function createProjectController(req, res) {
    try {
        const userData = await checkUser(req, res)
        console.log(userData)
        if (userData.error) return 
        const {Project_Name, Project_Desc} = req.body
        if (!Project_Name || !Project_Desc) return res.status(400).send({error: 'fields do not match'})
        const result = await createNewProject({
            User_ID: userData.data.userID,
            Project_Name: Project_Name,
            Project_Desc: Project_Desc
        })
        if (result.error) return res.status(400).send(result)
        const Data = await FinalConstructData(userData?.data.userID, userData.data.username, null, userData.userToken)
        return res.status(200).send(Data)
    } catch (error) {
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
        const result = await UpdateProject({
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
        if (prefixes.length == 0) {
            const result = await DeleteProject({
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
            const result1 = await deleteAllFileUnderProject(Project_ID)
            if (result1.error) {
                res.status(400).send({error: 'An unexpected Error came up'})
                return
            }
            // deleting the project from the database
            const result2 = await DeleteProject({
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

async function checkUser(request, response) {
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

