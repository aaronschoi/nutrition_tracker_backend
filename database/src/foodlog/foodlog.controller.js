const service = require("./foodlog.service");
const aeb = require("../errors/asyncErrorBoundary");

const errorCode = (code, msg) => {
  switch (code) {
    case 400:
      return {
        status: code,
        message: msg ? msg : "Bad Request",
      };
    case 401:
      return {
        status: code,
        message: msg ? msg : "Unauthorized",
      };
    case 403:
      return {
        status: code,
        message: msg ? msg : "Forbidden",
      };
    case 404:
      return {
        status: code,
        message: msg ? msg : "Not Found",
      };
  }
};

const addFood = async (req, res, next) => {
  const newFood = {...req.body.data};
  const data = await service.create(newFood)
  res.json({data})
}

const readLogs = async (req, res, next) => {
  const { userid } = req.params;
  const data = await service.read(userid)
  res.json({data})
}

const idExists = async (req, res, next) => {
  const { food_log_id } = req.body.data;
  const log = await service.read(food_log_id)
  if(log) {
    res.locals.log = log;
    return next();
  }
  else {
    return next(errorCode(400), "Log does not exist in Database")
  }
}

const update = async (req, res, next) => {
  const updatedLog = {...res.locals.log};
  const data = await service.update(updatedLog);
  res.json({data})
}

const destroy = async (req, res, next) => {
  const { food_log_id } = res.locals.log;
  await service.destroy(food_log_id);
  res.sendStatus(204)
}

module.exports = {
  addFood: [aeb(addFood)],
  readLogs: [aeb(readLogs)],
  update: [aeb(idExists), aeb(update)],
  delete: [aeb(idExists), aeb(destroy)]
};
