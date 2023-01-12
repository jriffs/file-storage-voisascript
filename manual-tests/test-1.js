import { getAll, getAllProjectsByUser, getOneProjectByUser } from "../model/db.js";
import { constructData } from "../utils/construct-data.js";
import { getDate_TimeStamp } from "../utils/getDate.js";

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

let date = getDate_TimeStamp()
console.log(date)