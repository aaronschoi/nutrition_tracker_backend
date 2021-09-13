require('dotenv').config();
const path = require("path");

const {
  REFRESH_URL = "postgresql://postgres@localhost/postgres",
  // DATABASE_URL_DEVELOPMENT = "postgresql://postgres@localhost/postgres",
  DEBUG,
} = process.env;

module.exports = {
  development: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: REFRESH_URL,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  // production: {
  //   client: "postgresql",
  //   pool: { min: 1, max: 5 },
  //   connection: DATABASE_URL,
  //   migrations: {
  //     directory: path.join(__dirname, "src", "db", "migrations"),
  //   },
  //   seeds: {
  //     directory: path.join(__dirname, "src", "db", "seeds"),
  //   },
  //   debug: !!DEBUG,
  // },
};