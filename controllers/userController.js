const bcrypt = require('bcryptjs');
const { User } = require('../models');

exports.loginForm = (req, res) => {
  res.render('login');
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });

  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.userId = user.id;
    res.redirect('/pacotes');
  } else {
    res.render('login', { error: 'Credenciais inválidas' });
  }
};


exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};
