const router = require("express").Router();
const auth = require("./auth");
const api = require("./api");

router.get("/", (req, res) => {
  res.send({ status: "Success" });
});

router.use("/auth", auth);
router.use("/api", api);

module.exports = router;
