// import env from 'dotenv'
import mysql from 'mysql2'
import { v4 } from 'uuid'
import { promisify } from "util";
import { getDate_TimeStamp } from '../utils/getDate.js';
import fs from "fs"
// import { Unique } from '../utils/generate-random.js'
// env.config()
const db_URL = process.env.DATABASE_URL

// console.log(db_URL)
const config = {
    host: '',
    user: '',
    password: '',
    database: '',
    keepAliveInitialDelay: 10000,
    enableKeepAlive: true,
    ssl: {
        key: fs.readFileSync('client-key.pem'),
        cert: fs.readFileSync('client-cert.pem')
    }
}

const parsedUrl = new URL(db_URL)

config.host = /* 'ps:' +  */parsedUrl.host /* + '/' + parsedUrl.pathname.substring(1) */;
config.user = parsedUrl.username;
config.password = parsedUrl.password;
config.database = /* parsedUrl.searchParams.get('dbname') */ /* '/' + */ parsedUrl.pathname.substring(1)

// console.log(config)

// export const connection = mysql.createConnection(db_URL)
const pool = mysql.createPool(config)
// const query = promisify(connection.query).bind(connection)
const query = promisify(pool.query).bind(pool)

// console.log(query)

/* connection.connect((err) => {
    if (err) {
        throw err
    }
    console.log('successfully connected 👍👍')
}) */

export async function getAll(table) { 
    const query_string = `SELECT * FROM ${table}`
    const result = await query(query_string).then((result) => {return result}, (err) => {return err})
    if (result?.errno) {
        return {error: `${result.code}`}
    }
    return result
}

export async function getAllPool(table) { 
    const query_string = `SELECT * FROM ${table}`
    const result = await query(query_string).then((result) => {return result}, (err) => {return err})
    if (result?.errno) {
        console.log(result)
        return {error: `${result.code}`}
    }
    return result
}

export async function getAllProjectsByUser(userID) { 
    const query_string = `SELECT * FROM Projects where User_ID='${userID}'`
    const result = await query(query_string).then((result) => {return result}, (err) => {return err})
    if (result?.errno) {
        return {error: `${result.code}`}
    }return result
}

export async function getAllFilesByUser(projectID) { 
    const query_string = `select * from Files where Project_ID='${projectID}'`
    const result = await query(query_string).then((result) => {return result}, (err) => {return err})
    if (result?.errno) {
        return {error: `${result.code}`}
    }
    return result
}

export async function getOneProjectByUser(Project_ID, userID, projectName){
    const query_string_1 = `SELECT * FROM Projects WHERE id='${Project_ID}' and User_ID='${userID}'`
    const query_string_2 = `SELECT * FROM Projects WHERE Project_Name='${projectName}' and User_ID='${userID}'`
    if (projectName) {
        const result = await query(query_string_2).then((result) => {return result}, (err) => {return err})
        if (result?.errno) {
            return {error: `${result.code}`}
        }
        return result
    }
    const result = await query(query_string_1).then((result) => {return result}, (err) => {return err})
    if (result?.errno) {
        return {error: `${result.code}`}
    }
    return result
}

export async function getOneFile(id, projectID, File_Name){
    const query_string_1 = `SELECT * FROM Files WHERE id='${id}' and Project_ID='${projectID}'`
    const query_string_2 = `SELECT * FROM Files WHERE File_Name='${File_Name}' and Project_ID='${projectID}'`
    if (File_Name) {
        const result = await query(query_string_2).then((result) => {return result}, (err) => {return err})
        if (result?.errno) {
            return {error: `${result.code}`}
        }
        return result
    }
    const result = await query(query_string_1).then((result) => {return result}, (err) => {return err})
    if (result?.errno) {
        return {error: `${result.code}`}
    }
    return result
}

export async function createNewProject({User_ID, Project_Name, Project_Desc}) {
    const id = `${v4()}`
    const {date, timeStmp} = getDate_TimeStamp()
    const query_string_2 = `INSERT INTO Projects (id, User_ID, Project_Name, Project_Desc, Date_created, Time_stamp)
    SELECT '${id}', '${User_ID}', '${Project_Name}', '${Project_Desc}', '${date}', '${timeStmp}' 
    WHERE NOT EXISTS (SELECT * FROM Projects WHERE Project_Name='${Project_Name}' and User_ID='${User_ID}')`
    const result_2 = await query(query_string_2).then((result) => {return result}, (err) => {return err})
    if (result_2.errno) {
        return {error: `${result_2}`}
    }
    return {success: `project created succesfully`} 
}

export async function createNewFile({ User_ID, File_Name, Project_ID, fileURL}) {
    const id = `${v4()}`
    const {date, timeStmp} = getDate_TimeStamp()
    const query_string_2 = `INSERT INTO Files (id, Project_ID, File_Name, File_URL, Date_created, Time_stamp)
    VALUES ('${id}', '${Project_ID}', '${File_Name}', '${fileURL}', '${date}', '${timeStmp}')`    
    const project = await getOneProjectByUser(Project_ID, User_ID)
    if (project?.error) {
        return {error: `${project.error}`}
    }
    if (project.length == 0) {
        return {error: `No Project with that Project_ID`, at: 'creat new file'}
    }
    const Existing_file = await getOneFile(null, Project_ID, File_Name)
    if (Existing_file?.error) {
        return {error: `${Existing_file?.error}`}
    }
    if (Existing_file.length > 0) {
        return {error: `File with that name already exists`}
    }
    const result = await query(query_string_2).then((result) => {return result}, (err) => {return err})
    if (result?.errno) {
        return {error: `${result?.code}`}
    }
    return {success: 'file successfully created'}
}

export async function UpdateProject({ Project_ID, User_ID, NewProjectName, Project_Desc}) {
    const query_string_2 = `UPDATE Projects 
    SET Project_Name='${NewProjectName}', Project_Desc='${Project_Desc}' 
    WHERE EXISTS (SELECT 1 FROM dual WHERE id='${Project_ID}' and User_ID='${User_ID}')`
    // const project = await getOneProjectByUser(Project_ID, User_ID)
    /* if (project?.error) {
        return {error: `${project.error}`}
    }
    if (project.length == 0) {
        return {error: `No Project with that Project_ID`, at: 'update project'}
    } */
    const result = await query(query_string_2).then((result) => {return result}, (err) => {return err})
    if (result?.errno) {
        return {error: `${result?.code}`}
    }
    return {success: 'project successfully updated'}
}

export async function UpdateFileURL({ Project_ID, File_Name, User_ID, fileURL}) {
    const query_string_2 = `UPDATE Files 
    SET File_URL='${fileURL}' WHERE Project_ID='${Project_ID}' and File_Name='${File_Name}'`
    const project = await getOneProjectByUser(Project_ID, User_ID)
    if (project?.error) {
        return {error: `${project.error}`}
    }
    if (project.length == 0) {
        return {error: `No Project with that Project_ID`, at: 'update file url'}
    }
    const result = await query(query_string_2).then((result) => {return result}, (err) => {return err})
    if (result?.errno) {
        return {error: `${result?.code}`}
    }
    return {success: 'File successfully updated'}
}

export async function DeleteProject({id, User_ID}) {
    const query_string_2 = `delete from Projects where id='${id}' and User_ID='${User_ID}'`
    const project = await getOneProjectByUser(id, User_ID)
    if (project?.error) {
        return {error: `${project.error}`}
    }
    if (project.length == 0) {
        return {error: `No Project with that Project_ID`, at: 'delete project'}
    }
    const result = await query(query_string_2).then((result) => {return result}, (err) => {return err})
    if (result?.errno) {
        return {error: `${result?.code}`}
    }
    return {success: 'project successfully deleted'}
}

export async function DeleteFile({id, Project_ID}) {
    const query_string_2 = `delete from Files where id='${id}'`
    const file = await getOneFile(id, Project_ID)
    if (file?.error) {
        return {error: `${file.error}`}
    }
    if (file.length == 0) {
        return {error: `No file with that ID`}
    }
    const result = await query(query_string_2).then((result) => {return result}, (err) => {return err})
    if (result?.errno) {
        return {error: `${result?.code}`}
    }
    return {success: 'file successfully deleted'}
}

export async function deleteAllFileUnderProject(projectID) {
    const query_string_2 = `delete from Files where Project_ID='${projectID}'`
    const result = await query(query_string_2).then((result) => {return result}, (err) => {return err})
    if (result?.errno) {
        return {error: `${result?.code}`}
    }
    return {success: 'File successfully deleted'}
}





