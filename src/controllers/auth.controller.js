const accountProvision = require('../provisioning/accountProvision.service');

exports.register = async (req, res) => {

  const { email, password } = req.body;

  const user = await createUser(email, password);

  await accountProvision.provisionUserAccounts(user.id);

  res.json({ user });
};
