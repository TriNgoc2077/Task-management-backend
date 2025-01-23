const express = require('express');
const database = require('./config/database');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const cors = require('cors'); //Cross-Origin Resource Sharing
require('dotenv').config();
const routerApiVer1 = require('./API/v1/routes/index.route');
const app = express();
const port = process.env.PORT;

database.connect();
app.use(cors());
app.use(cookieParser('CNTN'));
app.use(bodyParser.json());
// Router v1 
routerApiVer1(app);

app.listen(port, () => {
    console.log(`App listening in port ${port}`);
});