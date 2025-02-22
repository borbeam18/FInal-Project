const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'final_project'
});

db.connect((err) =>{
    if(err){
        console.error('Error Connection To The Database', err.stack);
        return;
    }
    console.log('Connected To Database');
});

module.exports = db;