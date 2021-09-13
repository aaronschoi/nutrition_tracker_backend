const service = require("./refresh.service");
const aeb = require("../errors/asyncErrorBoundary");
const jwt = require("jsonwebtoken");

const generateAccessToken = (user) =>
  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "59m" });

const errorCode = (code, msg) => {
  switch (code) {
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

const login = async (req, res, next) => {
  const { username, password } = req.body.data;
  const user = { username, password };

  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

  await service.create({ refresh_token: refreshToken });

  res.json({ accessToken, refreshToken });
};

const refreshTokenExists = async (req, res, next) => {
  const { refreshToken } = req.body.data;
  const refresh = await service.read(refreshToken);
  if (refresh) {
    res.locals.refresh = refresh;
    return next();
  } else {
    return next(errorCode(404));
  }
};

const refresh = async (req, res, next) => {
  const { refresh_token } = res.locals.refresh;
  jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
    if (error) return next(errorCode(403));
    const { username, password } = user;
    const accessToken = generateAccessToken({ username, password });
    res.json({ accessToken });
  });
};

const logout = async (req, res, next) => {
  const { refresh_token_id } = res.locals.refresh;
  await service.destroy(refresh_token_id);
  return res.sendStatus(204);
};

module.exports = {
  login: [aeb(login)],
  logout: [aeb(refreshTokenExists), aeb(logout)],
  refresh: [aeb(refreshTokenExists), aeb(refresh)],
};
