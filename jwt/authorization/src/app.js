const express = require("express");
const cors = require("cors");
const errorHandler = require("./errors/errorHandler");
const notFound = require("./errors/notFound");
const app = express();

const refreshRouter = require('./RefreshTokens/refresh.router')

app.use(cors());
app.use(express.json());

app.use('/refresh', refreshRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;