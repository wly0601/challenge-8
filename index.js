require('dotenv').config()
const express = require("express")
const cors = require("cors")
const morgan = require("morgan");
const router = require("./app/router")
const { MORGAN_FORMAT } = require("./config/application")
const app = express();
const PORT = process.env.PORT || 8000;

console.clear();

app.use(morgan(MORGAN_FORMAT));
app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
})

module.exports = router.apply(app);
