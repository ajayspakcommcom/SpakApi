
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(cookieParser());
app.use(cors(corsOptions));

const tangerineRoutes = require('./routes/tangerine');

app.use(tangerineRoutes);

app.listen(process.env.PORT || 3333, () => {
  console.clear();
  console.log("Application listening on port 3333!");
});
