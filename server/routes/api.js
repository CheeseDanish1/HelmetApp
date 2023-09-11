const router = require("express").Router();
const Helmet = require("../database/models/HelmetConfig");
const User = require("../database/models/UserConfig");
const sendCrashNotification = require("../utils/sendCrashNotification");

router.get("/", (req, res) => {
  res.send({ status: "succuss" });
});

router.put("/child", async (req, res) => {
  const { first_name, last_name, age, helmet_id } = req.body;

  if (!req.user)
    return res.send({
      error: true,
      message: "You must be logged in ",
    });

  await User.updateOne(
    { email: req.user.email },
    {
      $push: {
        children: {
          first_name,
          last_name,
          age,
          helmet_id,
        },
      },
    }
  );

  return res.send({ error: false, message: " Success" });
});

router.get("/helmets", async (req, res) => {
  if (!req.user)
    return res.send({
      error: true,
      message: "You must be logged in",
    });

  let user = await User.findOne({ email: req.user.email });
  let helmetIds = user.children.map((child) => child.helmet_id);

  let helmets = [];
  for (let i = 0; i < helmetIds.length; i++) {
    let helmet = await Helmet.findOne({ id: helmetIds[i] });
    helmets.push(helmet);
  }

  return res.send({ error: false, helmets });
});

router.delete("/helmet", async (req, res) => {
  const { id } = req.body;
  if (!req.user)
    return res.send({
      error: true,
      message: "You must be logged in",
    });

  if (!id) return res.send({ error: true, message: "An id must be provided" });

  await Helmet.deleteOne({ id });
  return res.send({ error: false, helmet: null });
});

router.put("/helmet", async (req, res) => {
  const { id } = req.body;
  if (!req.user)
    return res.send({
      error: true,
      message: "You must be logged in",
    });

  if (!id) return res.send({ error: true, message: "An id must be provided" });

  let helmet = await Helmet.create({ id });
  return res.send({ error: false, helmet });
});

// TODO: FINISH THIS
router.put("/crash_detected", async (req, res) => {
  if (!req.user) {
    return res.send({
      error: true,
      message: "You must be logged in",
    });
  }

  let user = await User.findOne({ email: req.user.email });
  sendCrashNotification(user.notification_tokens);
});

router.post("/notification_token", async (req, res) => {
  const { token } = req.body;

  if (!req.user) {
    return res.send({
      error: true,
      message: "You must be logged in to store your notification token",
    });
  }

  let user = await User.findOne({ email: req.user.email });

  if (
    user.notification_tokens &&
    (containsObject(user.notification_tokens, token) ||
      user.notification_tokens.some((pushToken) => pushToken == token))
  ) {
    return res.send({ error: true, message: "This token already exists" });
  }

  await User.updateOne(
    { email: req.user.email },
    { $push: { notification_tokens: token } },
    { new: true }
  );

  return res.send({ error: false, status: "Succuss" });
});

function containsObject(arr, obj) {
  for (let i = 0; i < arr.length; i++) {
    if (JSON.stringify(arr[i]) === JSON.stringify(obj)) {
      return true;
    }
  }
  return false;
}

module.exports = router;
