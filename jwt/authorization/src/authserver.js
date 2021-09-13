require('dotenv').config()
const PORT = process.env.JWT_PORT;

const app = require("./app");
const knex = require("./db/connection");

knex.migrate
  .latest()
  .then((migrations) => {
    console.log("migrations", migrations);
    app.listen(PORT, listener);
  })
  .catch((error) => {
    console.error(error);
    knex.destroy();
  });

  const listener = () => console.log(`Authorization Server is running on PORT:${PORT}`)