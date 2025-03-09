const fs = require('fs');
const mysql = require('mysql2');
const config = JSON.parse(fs.readFileSync('conf.json', 'utf8'));

config.ssl = {
    ca: fs.readFileSync('ca.pem')
};

const connection = mysql.createConnection(config);

const executeQuery = (sql) => {
    return new Promise((resolve, reject) => {      
          connection.query(sql, function (err, result) {
             if (err) {
                console.error(err);
                reject(err);     
             }   
             console.log('done');
             resolve(result);         
       });
    });
};

const database = {
    createTable: () => {
        return executeQuery(`
        CREATE TABLE IF NOT EXISTS todo (
            id INT AUTO_INCREMENT PRIMARY KEY,
            titolo VARCHAR(255) NOT NULL,
            descrizione TEXT,
            data DATETIME NOT NULL,
            completed BOOLEAN DEFAULT FALSE
        );
        `);      
    },
    insert: (titolo, descrizione, data, completed) => {
        let sql = `
        INSERT INTO todo (titolo, descrizione, data, completed) VALUES ('$TITOLO', '$DESCRIZIONE', '$DATA', $COMPLETED)
        `;
        sql = sql.replace("$TITOLO", titolo)
                 .replace("$DESCRIZIONE", descrizione)
                 .replace("$DATA", data)
                 .replace("$COMPLETED", completed);
        return executeQuery(sql); 
    },
    select: () => {
        const sql = `
        SELECT id, titolo, descrizione, data, completed FROM todo 
        `;
        return executeQuery(sql); 
    },
    delete: (id) => {
        let sql = `
        DELETE FROM todo WHERE id=$ID
        `;
        sql = sql.replace("$ID", id);
        return executeQuery(sql); 
    },
    modifyTable: (alterQuery) => {
        return executeQuery(alterQuery);
    }
};

module.exports = database;
