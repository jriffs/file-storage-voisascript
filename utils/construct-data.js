import { getAllProjectsByUser, getAllFilesByUser } from "../model/db.js";
import { DatabaseAdmin } from "../model/db-admin.js";

export async function constructData(userID) {
    try {
        const DB = new DatabaseAdmin()
        let data,
        finalProjectsArr = [],
        finalFilesArr = [],
        fileStat = 0
        const projectsArr = await DB.getAllProjectsByUser(userID)
        console.log(projectsArr)
        if (projectsArr?.error) {
            console.log(projectsArr.error)
            return
        }
        for (const project of projectsArr) {
            const {id} = project
            const files = await DB.getAllFilesByUser(id)
            if (files?.error) return
            finalFilesArr.push(files)
            fileStat = fileStat + files.length
            const projectData = {
                projectName: project.Project_Name,
                projectID: id,
                projectDesc: project.Project_Desc
            }
            finalProjectsArr.push(projectData)
        }
        const projectStat = projectsArr.length
        data = {finalProjectsArr, projectStat, finalFilesArr, fileStat}
        return data
    } catch (error) {
        throw new Error(`${error}`)
    }
}

export async function FinalConstructData(userId, username, url, userToken) {
    const { finalProjectsArr, projectStat, finalFilesArr, fileStat} = await constructData(userId)
    if (url) {
        return {
            url,
            userToken,
            username,
            projects: finalProjectsArr,
            files: finalFilesArr,
            stats: {
            projects: projectStat,
            files: fileStat
            } 
        }
    }
    return {
        userToken,
        username,
        projects: finalProjectsArr,
        files: finalFilesArr,
        stats: {
          projects: projectStat,
          files: fileStat
        } 
    }
}

/* let data = await constructData('65e3aa8b-e18c-453b-bc2e-8b330dfa9021')
console.log(data) */