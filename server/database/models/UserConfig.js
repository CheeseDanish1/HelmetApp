const mongoose = require("mongoose");

const UserConfig = new mongoose.Schema(
  {
    password: String,
    email: String,
    phone: String,
    first_name: String,
    last_name: String,
    children: [
      {
        first_name: String,
        last_name: String,
        helmet_id: String,
        age: Number,
      },
    ],
    notification_tokens: [],
  },
  { collection: "UserConfig", typeKey: "$type" }
);

module.exports = mongoose.model("UserConfig", UserConfig);
