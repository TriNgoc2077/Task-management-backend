const express = require('express');
const database = require('./config/database');
require('dotenv').config();
const routerApiVer1 = require("./API/v1/routes/index.route");
const app = express();
const port = process.env.PORT;

database.connect();
// Router v1 
routerApiVer1(app);

app.listen(port, () => {
    console.log(`App listening in port ${port}`);
});