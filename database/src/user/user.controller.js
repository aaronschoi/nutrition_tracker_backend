const service = require("./user.service");
const aeb = require("../errors/asyncErrorBoundary");
const jwt = require("jsonwebtoken");

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

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return next(errorCode(401));

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) return next(errorCode(403));
    req.user = user;
    next();
  });
};

const usernameMatch = async (req, res, next) => {
  const { username } = req.user;
  const unMatches = await service.usernameMatch(username);
  if(unMatches) {
    res.locals.user = unMatches;
    return next();
  }
  else {
    return next(errorCode(404, "Username cannot be found in the database."))
  }
}

const passwordMatch = async (req, res, next) => {
  const { password } = req.user;
  const pwMatches = password === res.locals.user.password;
  if(pwMatches) {
    return next();
  }
  else {
    return next(errorCode(404, "wrong password"))
  }
}

const getUser = async (req, res, next) => {
  const data = res.locals.user;
  res.json(data);
};

//createUser validation
const hasUsername = async (req, res, next) => {
  const { username } = req.body.data;
  if (username) {
    return next();
  } else {
    return next(errorCode(400, "A username is necessary"));
  }
};

const hasPassword = async (req, res, next) => {
  const { password } = req.body.data;
  if (password) {
    return next();
  } else {
    return next(errorCode(400, "A password is necessary"));
  }
};

const hasFirst = async (req, res, next) => {
  const { first } = req.body.data;
  if (first) {
    return next();
  } else {
    return next(errorCode(400, "A first name is necessary"));
  }
};

const hasLast = async (req, res, next) => {
  const { last } = req.body.data;
  if (last) {
    return next();
  } else {
    return next(errorCode(400, "A last name is necessary"));
  }
};

const hasDOB = async (req, res, next) => {
  const { dob } = req.body.data;
  if (dob) {
    return next();
  } else {
    return next(errorCode(400, "A birth-date is necessary"));
  }
};

const hasSex = async (req, res, next) => {
  const { sex } = req.body.data;
  if (sex) {
    return next();
  } else {
    return next(
      errorCode(
        400,
        "Please choose the sex that most closely describes you biologically."
      )
    );
  }
};

const hasUSDA = async (req, res, next) => {
  const { usda } = req.body.data;
  if (usda) {
    return next();
  } else {
    return next(errorCode(400, "An USDA api key is necessary"));
  }
};

const createUser = async (req, res, next) => {
  const newUser = {
    ...req.body.data,
  };
  const data = await service.create(newUser);
  res.json(data);
};

const idExists = async (req, res, next) => {
  const { user_id } = req.body.data;
  const user = await service.findUserByID(user_id);
  if (user) {
    res.locals.user = user;
    return next();
  } else {
    return next(errorCode(404, "User does not exist"));
  }
};

const update = async (req, res, next) => {
  const updatedUser = { ...req.body.data };
  const data = await service.update(updatedUser);
  res.json({ data });
};

//DELETE USER VALIDATION
const isAdmin = async (req, res, next) => {
  const { admin } = req.body.data;
  if (admin) {
    return next();
  } else {
    return next(errorCode(401));
  }
};

const destroy = async (req, res, next) => {
  const { user_id } = res.locals.user;
  await service.destroy(user_id);
  res.sendStatus(204);
};

const list = async (req, res, next) => {
  const data = await service.list();
  res.json({ data });
};

const ez = async (req, res, next) => {
  res.json({data: "hello"})
}

module.exports = {
  getUser: [aeb(authenticateToken), aeb(usernameMatch), aeb(passwordMatch), aeb(getUser)],
  createUser: [
    aeb(hasUsername),
    aeb(hasPassword),
    aeb(hasFirst),
    aeb(hasLast),
    aeb(hasDOB),
    aeb(hasSex),
    aeb(hasUSDA),
    aeb(createUser),
  ],
  update: [
    aeb(hasUsername),
    aeb(hasPassword),
    aeb(hasFirst),
    aeb(hasLast),
    aeb(hasDOB),
    aeb(hasSex),
    aeb(hasUSDA),
    aeb(update),
  ],
  delete: [aeb(isAdmin), aeb(idExists), aeb(destroy)],
  list: [aeb(isAdmin), aeb(list)],
  ez: [aeb(ez)]
};
