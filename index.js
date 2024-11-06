const express = require("express")
const cors = require("cors")
// const morgan = require("morgan");
// const swaggerUI = require("swagger-ui-express");
const router = require("./router")
// const swaggerDocument = require("../docs/swagger.json");
// const { MORGAN_FORMAT } = require("../config/application")
const app = express();

// app.use(morgan(MORGAN_FORMAT));
app.use(express.json());

const { PORT = 3001 } = process.env;

app.use(cors());
app.listen(PORT, "0.0.0.0", () => {
    console.log("Listening on port http://localhost:" + PORT);
});
// app.get("/documentation.json", (req, res) => res.send(swaggerDocument));
// app.use("/documentation", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

module.exports = router.apply(app);