import { getAll, getAllProjectsByUser, getOneProjectByUser } from "../model/db.js";
import { constructData } from "../utils/construct-data.js";

async function somn () {
    const { finalProjectsArr, projectStat, finalFilesArr, fileStat} = await constructData('65e3aa8b-e18c-453b-bc2e-8b330dfa9021')
    console.table([finalProjectsArr, projectStat, finalFilesArr, fileStat])
}

somn()