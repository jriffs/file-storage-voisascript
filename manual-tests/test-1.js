// import { getAll, getAllProjectsByUser, getOneProjectByUser } from "../model/db.js";
// import { constructData } from "../utils/construct-data.js";
// import { getDate_TimeStamp } from "../utils/getDate.js";
import {DatabaseAdmin} from "../Background-jobs/db-administrator.js"

/* async function somn () {
    const { finalProjectsArr, projectStat, finalFilesArr, fileStat} = await constructData('65e3aa8b-e18c-453b-bc2e-8b330dfa9021')
    console.table([finalProjectsArr, projectStat, finalFilesArr, fileStat])
}
 */
// somn()

/* async function doSomn() {
    const result = await getAllProjectsByUser('65e3aa8b-e18c-453b-bc2e-8b330dfa9021')
    console.log(result.length)
} */

// doSomn()

/* let date = getDate_TimeStamp()
console.log(date) */

async function somn() {
    const db = new DatabaseAdmin()
    const res = await db.createNewProject({
        User_ID: "dcc29912-e25a-4ef9-928f-d8f14c05fc5f",
        Project_Desc: "Testing the recreation of the db stuff",
        Project_Name: "Recreate project"
    })
    console.log(res)
}

somn()

