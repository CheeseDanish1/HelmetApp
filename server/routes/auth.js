const router = require("express").Router();
const User = require("../database/models/UserConfig");
const { encrypt, encryptData, decrypt } = require("../utils/crypt");
const serialize = require("../utils/serialize");
const COOKIE_NAME = "authorization";

router.get("/local/user", async (req, res) => {
  let user = req.user;
  if (!user) return res.send({ user: null });
  return res.send({ user });
});

router.post("/local/signup", async (req, res) => {
  let { password, email, phone, first_name, last_name } = req.body;
  email = email.toLowerCase();
  if (!password || !email)
    return res.status(200).send({
      message: "You must provide all requested information",
      error: true,
    });

  let emailRegex = new RegExp(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  if (!emailRegex.test(email.toLowerCase())) {
    return res.send({
      message: "You must provide a valid email",
      error: true,
    });
  }

  let phoneRegex = new RegExp(
    /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
  );
  if (!phoneRegex.test(phone)) {
    return res.send({
      error: true,
      message: "You must provide a valid phone number",
    });
  }

  const oldUser2 = await User.findOne({ email });
  if (oldUser2)
    return res
      .status(200)
      .send({ error: true, message: "That email is already in use" });

  const oldUser3 = await User.findOne({ phone });
  if (oldUser3)
    return res
      .status(200)
      .send({ error: true, message: "That phone number is already in use" });

  const encryptedPassword = encrypt(password);
  const user = {
    ...(await User.create({
      password: encryptedPassword,
      children: [],
      email,
      phone,
      first_name,
      last_name,
    })),
  }._doc;

  const encryptedUser = encryptData(user, "1w");
  return res
    .status(200)
    .cookie(COOKIE_NAME, encryptedUser, { httpOnly: true })
    .send({
      user: await serialize.user(user),
      message: "Successfully signed up!",
    });
});

router.post("/local/logout", async (req, res) => {
  if (!req.user) return res.send({ error: true, message: "Unauthorized" });
  const { token } = req.body;

  if (token) {
    await User.updateOne(
      { email: req.user.email },
      { $pull: { notification_tokens: token } }
    );
  }

  res
    .status(200)
    .clearCookie(COOKIE_NAME)
    .send({ succuss: true, message: "Logout Success" });
});

router.post("/local/login", async (req, res) => {
  let { email, password } = req.body;

  email = email.toLowerCase();

  if (!email || !password)
    return res.status(200).send({
      message: "You must provide an email and a password",
      error: true,
    });

  const oldUser = await User.findOne({ email });
  if (!oldUser)
    return res
      .status(200)
      .send({ error: true, message: "Could not find user" });

  const decryptedPass = decrypt(oldUser.password).toString();
  if (decryptedPass != password) {
    return res.send({ message: "Incorrect password", error: true });
  }

  const encryptedUser = encryptData({ ...oldUser }._doc, "1w");
  const user = await serialize.user(oldUser);

  return res
    .status(200)
    .cookie(COOKIE_NAME, encryptedUser, { httpOnly: true })
    .setHeader("authorization", encryptedUser)
    .send({
      message: "Successfully logged in!",
      user,
    });
});

module.exports = router;
