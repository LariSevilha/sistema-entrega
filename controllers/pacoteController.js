// controllers/pacoteController.js
const { Pacote } = require('../models');

exports.list = async (req, res) => {
    try {
        const userId = req.user.id;
        const pacotes = await Pacote.findAll({ where: { userId } });
        res.render('lista', { pacotes });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar pacotes');
    }
};


// Exibe o formulário de cadastro
exports.createForm = (req, res) => {
    res.render('cadastro');
};

// Cria um novo pacote
exports.create = async (req, res) => {
    try {
        const { remetente, destinatario, endereco } = req.body;
        const userId = req.user.id;  
        await Pacote.create({ remetente, destinatario, endereco, userId });
        res.redirect('/pacotes');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao criar pacote');
    }
};

exports.details = async (req, res) => {
    try {
        const pacote = await Pacote.findByPk(req.params.id);
        if (pacote) {
            res.render('detalhes', { pacote });
        } else {
            res.status(404).send('Pacote não encontrado');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar detalhes do pacote');
    }
};

 
