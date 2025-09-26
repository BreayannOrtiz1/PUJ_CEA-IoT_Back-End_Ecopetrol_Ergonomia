const express = require('express');

const app = express()
const port = 5173
var sql = require("mssql");

var config = {
    user: 'ECOPETROL',
	  password: 'Ergonomia2025*',
	  server: 'sqlceaiotserver.database.windows.net',
    database: 'SQLCEAIOTDB',
    encrypt: true
  }

function querysqldb(query) {
  sql.connect(config, function (err) {
    if (err) console.log(err);
    // create Request object
    var request = new sql.Request();
    // query to the database and get the records
    request.query(query, function (err, recordset) {
      if (err) console.log(err)
      // send records as a response
      console.log("antes")
      console.log(recordset)
      console.log("despues")
      return recordset;
      });
  });
}

app.use(express.json());

app.get('/api/v1/', (req, res) => {
  query= "select top 2* from dbo.ECOPETROL_Main_Telemetry"

  sql.connect(config, function (err) {
    if (err) console.log(err);
    // create Request object
    var request = new sql.Request();
    // query to the database and get the records
    request.query(query, function (err, recordset) {
      if (err) console.log(err)
      // send records as a response
      console.log(recordset)
      res.send(recordset.recordsets)
      });
  });

})

app.post('/api/v1/register/gateway', (req, res) => {
  console.log(req.body);
  res.json('Got a POST request')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
