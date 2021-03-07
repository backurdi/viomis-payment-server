const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const port = process.env.PORT;
const app = require("./app");
dotenv.config({ path: "./.env" });

const server = app.listen(port, () =>
  console.log(`listening on - http://localhost:${port}`)
);
