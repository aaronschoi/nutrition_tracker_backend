const express = require("express");
const cors = require("cors");
const errorHandler = require("./errors/errorHandler");
const notFound = require("./errors/notFound");
const app = express();

const userRouter = require('./user/user.router');
const foodLogRouter = require('./foodlog/foodlog.router')

app.use(cors());
app.use(express.json());

app.use('/user', userRouter)
app.use('/foodlog', foodLogRouter)

app.use(notFound);
app.use(errorHandler);

module.exports = app;