require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('express-flash');
const bcrypt = require('bcryptjs');
const methodOverride = require('method-override');  
const { User, Pacote } = require('./models');
const conn = require('./database/connection');

const app = express();
const port = process.env.SERVER_PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(methodOverride('_method')); // Configura o method-override para suportar métodos PUT e DELETE

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.use(session({
  name: 'session',
  secret: process.env.SESSION_SECRET || 'default-secret',
  resave: false,
  saveUninitialized: false,
  store: new FileStore({
    logFn: () => {},
    path: require('path').join(__dirname, 'sessions')
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600000,
    httpOnly: true
  }
}));

app.use(flash());

const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  } else {
    res.redirect('/login');
  }
};

app.use((req, res, next) => {
  if (req.session.userId) {
    res.locals.session = req.session;
  }
  next();
});

// Rotas
app.get('/', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/pacotes');
  }
  res.redirect('/login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  await User.create({ username, password: hashedPassword });
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });

  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.userId = user.id;
    res.redirect('/pacotes');
  } else {
    res.render('login', { error: 'Username ou senha inválidos' });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/pacotes');
    }

    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

app.get('/pacotes', isAuthenticated, async (req, res) => {
  try {
    const pacotes = await Pacote.findAll({ where: { userId: req.session.userId } });
    res.render('lista', { pacotes });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar pacotes');
  }
});

app.get('/pacotes/:id', isAuthenticated, async (req, res) => {
  try {
    const pacote = await Pacote.findOne({ where: { id: req.params.id, userId: req.session.userId } });
    if (pacote) {
      res.render('detalhes', { pacote });
    } else {
      res.status(404).send('Pacote não encontrado');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar detalhes do pacote');
  }
});

app.get('/cadastro', isAuthenticated, (req, res) => {
  res.render('cadastro');
});

app.post('/cadastro', isAuthenticated, async (req, res) => {
  try {
    const { remetente, destinatario, endereco } = req.body;
    await Pacote.create({ remetente, destinatario, endereco, userId: req.session.userId });
    res.redirect('/pacotes');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao criar pacote');
  }
});
 
app.post('/pacotes/delete/:id', async (req, res) => {
  const { id } = req.params; 
  await Pacote.destroy({ where: { id } });
  res.redirect('/pacotes');
});

conn
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Servidor iniciado: http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Não foi possível conectar ao banco de dados:', err);
  });
