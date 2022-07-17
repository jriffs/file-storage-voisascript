// require('dotenv').config()
const mysql = require('mysql2')
const { Unique } = require('../utils/generate-random')

const db_URL = process.env.database_url
const connection = mysql.createConnection(db_URL)

connection.connect((err) => {
    if (err) {
        throw err
    }
    console.log('successfully connected 👍👍')
})

async function getAll(table, onRowsReceived) { 
    const query_string = `SELECT * FROM ${table}`
    connection.query(query_string, (err, rows) => {
        if (err) {
           return onRowsReceived(err)
        }
        return onRowsReceived(null, rows) 
    })
}

async function createNewProject({User_ID, Project_Name, Project_Desc}, onReceived) {
    const query_string_1 = `SELECT * FROM Projects WHERE Project_Name='${Project_Name}'`
    const query_string_2 = `INSERT INTO Projects (User_ID	, Project_Name, 	Project_Desc)
    VALUES ('${User_ID}', '${Project_Name}', '${Project_Desc}')`
    connection.query(query_string_1, (err, rows) => {
        if (err) return onReceived(err)
        if (rows && rows.length > 0) {
            return onReceived(null, `Project with that project name already exists`)
        }
        connection.query(query_string_2, (err, rows) => {
            if (err) return onReceived(err)
            if (rows && rows.insertId) {
                return onReceived(null, `record inserted succesfully`)
            }
            return onReceived(null, `oops ... something went wrong`)
        })
    })
}

async function createNewFile({File_Name, Project_ID}, onReceived) {
    const id = `${Unique()}`
    const query_string_1 = `SELECT * FROM Files WHERE File_Name='${File_Name}'`
    const query_string_2 = `INSERT INTO Files (id, Project_ID, File_Name)
    VALUES ('${id}', '${Project_ID}', '${File_Name}')`
    connection.query(query_string_1, (err, rows) => {
        if (err) return onReceived(err, null)
        if (rows && rows.length > 0) {
            return onReceived(null, `File with that name already exists`)
        }
        connection.query(query_string_2, (err, rows) => {
            if (err) return onReceived(err)
            if (rows.insertId === 0) {
                return onReceived(null, `record inserted succesfully`)
            }
            return onReceived(null, `oops ... something went wrong`)
        })
    })
}

async function UpdateProject({id, Project_Name, Project_Desc}, onReceived) {
    const query_string_1 = `SELECT * FROM Projects WHERE id='${id}'`
    const query_string_2 = `UPDATE Projects 
    SET Project_Name='${Project_Name}', Project_Desc='${Project_Desc}' 
    WHERE id=${id}`
    connection.query(query_string_1, (err, rows) => {
        if (err) return onReceived(err)
        if (rows.length = 0) {
            return onReceived(null, `no records match that id`)
        }
        connection.query(query_string_2, (err, rows) => {
            if (err) return onReceived(err)
            if (rows && rows.insertId) {
                return onReceived(null, `record updated succesfully`)
            }
            return onReceived(null, `oops ... something went wrong`)
        })
    })
}

async function DeleteProject({id}, onReceived) {
    const query_string_1 = `SELECT * FROM Projects WHERE id='${id}'`
    const query_string_2 = `delete Projects, Files from Projects inner join Files on Files.Project_ID=Projects.id where Projects.id=${id}`
    connection.query(query_string_1, (err, rows) => {
        if (err) return onReceived(err)
        if (rows.length = 0) {
            return onReceived(null, `no records match that id`)
        }
        connection.query(query_string_2, (err, rows) => {
            if (err) return onReceived(err)
            if (rows && rows.insertId) {
                return onReceived(null, `record deleted succesfully`)
            }
            return onReceived(null, `oops ... something went wrong`)
        })
    })
}

async function DeleteFile({id}, onReceived) {
    const query_string_1 = `SELECT * FROM Files WHERE id='${id}'`
    const query_string_2 = `delete from Files where id='${id}'`
    connection.query(query_string_1, (err, rows) => {
        if (err) return onReceived(err)
        if (rows.length = 0) {
            return onReceived(null, `no records match that id`)
        }
        connection.query(query_string_2, (err, rows) => {
            if (err) return onReceived(err)
            if (rows && rows.insertId) {
                return onReceived(null, `record deleted succesfully`)
            }
            return onReceived(null, `oops ... something went wrong`)
        })
    })
}


module.exports = { getAll, createNewProject, createNewFile, UpdateProject, DeleteProject, DeleteFile }



