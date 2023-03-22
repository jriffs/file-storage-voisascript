// import env from 'dotenv'
import mysql from 'mysql2/promise'
import { v4 } from 'uuid'
import { getDate_TimeStamp } from '../utils/getDate.js';


// env.config()
const db_URL = process.env.DATABASE_URL

export class DatabaseAdmin {
    constructor(){}

    async getAllProjectsByUser(userID) {
        try {
            const connection = await mysql.createConnection(db_URL)
            const query_string = `SELECT * FROM Projects where User_ID=${mysql.escape(userID)}`
            const [row] = await connection.query(query_string)
            if (connection) await connection.end()
            return row
        } catch (error) {
            return {error}
        }
    }

    async getOneProjectByUser(Project_ID, userID, projectName) {
        try {
            const connection = await mysql.createConnection(db_URL)
            const query_string_1 = `SELECT * FROM Projects WHERE id=${mysql.escape(Project_ID)} and User_ID=${mysql.escape(userID)}`
            const query_string_2 = `SELECT * FROM Projects WHERE Project_Name=${mysql.escape(projectName)} and User_ID=${mysql.escape(userID)}`
            if (projectName) {
                const [row] = await connection.query(query_string_2)
                if (connection) await connection.end()
                return row
            } else {
                const [row] = await connection.query(query_string_1)
                if (connection) await connection.end()
                return row
            }
        } catch (error) {
            return {error}
        }
    }

    async getOneFile(id, projectID, File_Name) {
        try {
            const connection = await mysql.createConnection(db_URL)
            const query_string_1 = `SELECT * FROM Files WHERE id=${mysql.escape(id)} and Project_ID=${mysql.escape(projectID)}`
            const query_string_2 = `SELECT * FROM Files WHERE File_Name=${mysql.escape(File_Name)} and Project_ID=${mysql.escape(projectID)}`
            if (File_Name) {
                const [row] = await connection.query(query_string_2)
                if (connection) await connection.end()
                return row
            } else {
                const [row] = await connection.query(query_string_1)
                if (connection) await connection.end()
                return row
            }
        } catch (error) {
            return {error}
        }
    }

    async getAllFilesByUser(projectID) {
        try {
            const connection = await mysql.createConnection(db_URL)
            const query_string = `select * from Files where Project_ID=${mysql.escape(projectID)}`
            const [row] = await connection.query(query_string)
            if (connection) await connection.end()
            return row
        } catch (error) {
            return {error}
        }
    }

    async createNewProject({User_ID, Project_Name, Project_Desc}) {
        try {
            const connection = await mysql.createConnection(db_URL)
            const id = `${v4()}`
            const {date, timeStmp} = getDate_TimeStamp()
            const query_string_2 = `INSERT INTO Projects (id, User_ID, Project_Name, Project_Desc, Date_created, Time_stamp)
            SELECT '${id}', '${User_ID}', '${Project_Name}', '${Project_Desc}', '${date}', '${timeStmp}' 
            WHERE NOT EXISTS (SELECT * FROM Projects WHERE Project_Name=${mysql.escape(Project_Name)} and User_ID=${mysql.escape(User_ID)})`
            await connection.query(query_string_2)
            if (connection) await connection.end()
            return {success: `project created succesfully`}
        } catch (error) {
            return {error}
        }
    }

    async createNewFile({ User_ID, File_Name, Project_ID, fileURL}) {
        const id = `${v4()}`
        const {date, timeStmp} = getDate_TimeStamp()
        const connection = await mysql.createConnection(db_URL)
        const query_string_2 = `INSERT INTO Files (id, Project_ID, File_Name, File_URL, Date_created, Time_stamp)
        VALUES (${mysql.escape(id)}, ${mysql.escape(Project_ID)}, ${mysql.escape(File_Name)}, ${mysql.escape(fileURL)}, ${mysql.escape(date)}, ${mysql.escape(timeStmp)})`    
        const project = await this.getOneProjectByUser(Project_ID, User_ID)
        if (project?.error) {
            return {error: `${project.error}`}
        }
        if (project.length == 0) {
            return {error: `No Project with that Project_ID`, at: 'creat new file'}
        }
        const Existing_file = await this.getOneFile(null, Project_ID, File_Name)
        if (Existing_file?.error) {
            return {error: `${Existing_file?.error}`}
        }
        if (Existing_file.length > 0) {
            return {error: `File with that name already exists`}
        }
        await connection.query(query_string_2)
        if (connection) await connection.end()
        return {success: `File created succesfully`}
    }

    async UpdateProject({ Project_ID, User_ID, NewProjectName, Project_Desc}) {
        try {
            const connection = await mysql.createConnection(db_URL)
            const query_string_2 = `UPDATE Projects 
            SET Project_Name='${NewProjectName}', Project_Desc='${Project_Desc}' 
            WHERE EXISTS (SELECT 1 FROM dual WHERE id=${mysql.escape(Project_ID)} and User_ID=${mysql.escape(User_ID)})`
            await connection.query(query_string_2)
            if (connection) await connection.end()
            return {success: `project updated succesfully`}
        } catch (error) {
            return {error}
        }
        
    }

    async DeleteProject({id, User_ID}) {
        try {
            const connection = await mysql.createConnection(db_URL)
            const query_string_2 = `delete from Projects where id=${mysql.escape(id)} and User_ID=${mysql.escape(User_ID)}`
            const project = await this.getOneProjectByUser(id, User_ID)
            if (project?.error) {
                return {error: `${project.error}`}
            }
            if (project.length == 0) {
                return {error: `No Project with that Project_ID`, at: 'delete project'}
            }
            await connection.query(query_string_2)
            if (connection) await connection.end()
            return {success: `project deleted succesfully`}
        } catch (error) {
            return {error}
        }
        
    }

    async DeleteFile({id, Project_ID}) {
        try {
            const connection = await mysql.createConnection(db_URL)
            const query_string_2 = `delete from Files where id=${mysql.escape(id)}`
            const file = await this.getOneFile(id, Project_ID)
            if (file?.error) {
                return {error: `${file.error}`}
            }
            if (file.length == 0) {
                return {error: `No file with that ID`}
            }
            await connection.query(query_string_2)
            if (connection) await connection.end()
            return {success: `file deleted succesfully`}
        } catch (error) {
            return {error}
        }
        
    }

    async deleteAllFileUnderProject(projectID) {
        try {
            const connection = await mysql.createConnection(db_URL)
            const query_string_2 = `delete from Files where Project_ID='${projectID}'`
            await connection.query(query_string_2)
            if (connection) await connection.end()
            return {success: `Files deleted succesfully`} 
        } catch (error) {
            return {error}
        }
        
    }
}