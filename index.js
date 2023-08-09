require('dotenv').config()
const express = require("express")
const cors = require("cors")
const morgan = require("morgan");
const router = require("./app/router")
const { MORGAN_FORMAT } = require("./config/application")
const app = express();
const PORT = process.env.PORT || 8000;
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("../docs/swagger.json");

console.clear();

app.use(morgan(MORGAN_FORMAT));
app.use(cors());
app.use(express.json());
app.get("/documentation.json", (req, res) => res.send(swaggerDocument));
app.use("/documentation", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
})

module.exports = router.apply(app);
