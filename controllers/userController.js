const bcrypt = require('bcryptjs');
const { User } = require('../models/user');

class UserController {
  static async loginForm(req, res) {
    try {
      res.render('login');
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao carregar o formulário de login');
    }
  }

  static async login(req, res) {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ where: { username }, raw: true });
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.userId = user.id;
        res.redirect('/pacotes');
      } else {
        res.render('login', { error: 'Credenciais inválidas' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro no processo de login');
    }
  }

  static async logout(req, res) {
    try {
      req.session.destroy(() => {
        res.redirect('/login');
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao processar o logout');
    }
  }

  static async registerForm(req, res) {
    try {
      res.render('register');
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao carregar o formulário de registro');
    }
  }

  static async register(req, res) {
    const { username, password } = req.body;
    try {
      const hashedPassword = bcrypt.hashSync(password, 8);
      const newUser = {
        username: username,
        password: hashedPassword
      };

      await User.create(newUser);
      res.redirect('/login');
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao processar o registro');
    }
  }
}

