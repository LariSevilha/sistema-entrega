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
    if (!username || !password) {
      return res.render('login', { error: 'Credenciais inválidas' });
    }
    try {
      const user = await User.findOne({ where: { username: username }, raw: true });
      if (user) {
        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (passwordIsValid) {
          req.session.userId = user.id;
          return res.redirect('/pacotes');
        }
      }
      res.render('login', { error: 'Credenciais inválidas' });
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
    if (!username || !password) {
      return res.status(400).send('Dados de registro inválidos');
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 8);
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