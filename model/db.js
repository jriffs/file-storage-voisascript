const { execSync } = require("child_process")
const root = execSync("npm root -g").toString().trim();
require(`${root}/dotenv`).config()

const mysql = require('mysql2')
const db_URL = process.env.database_url
const connection = mysql.createConnection(db_URL)

connection.connect((err) => {
    if (err) {
        throw err
    }
    console.log('successfully connected 👍👍')
})



