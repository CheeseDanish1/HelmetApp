const HelmetConfig = require("../database/models/HelmetConfig");

module.exports.user = async (user) => {
  if (!user) return null;
  let children_arr = [];
  for (let i = 0; i < user.children.length; i++) {
    let h = user.children[i].helmet_id;
    const helmet = await HelmetConfig.findOne({ id: h });
    if (!helmet) continue;
    let replica = user.children[i];
    replica["helmet"] = helmet;
    children_arr.push(replica);
  }

  return {
    email: user.email,
    id: user._id,
    phone: user.phone,
    first_name: user.first_name,
    last_name: user.last_name,
    children: children_arr,
    notification_tokens: user.notification_tokens,
  };
};
