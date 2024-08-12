const { Pacote } = require('../models/pacote');

class PacoteController {
    static async list(req, res) {
        try {
            const userId = req.session.userId;
            if (!userId) return res.status(401).send('Usuário não autenticado');

            const pacotes = await Pacote.findAll({ where: { userId: userId }, raw: true });
            res.render('lista', { pacotes });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro ao buscar pacotes');
        }
    }

    static async createForm(req, res) {
        try {
            res.render('cadastro');
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro ao carregar o formulário de cadastro');
        }
    }

    static async create(req, res) {
        try {
            const { remetente, destinatario, endereco } = req.body;
            const userId = req.session.userId;
            if (!userId) return res.status(401).send('Usuário não autenticado');

            await Pacote.create({ remetente, destinatario, endereco, userId });
            res.redirect('/pacotes');
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro ao criar pacote');
        }
    }

    static async details(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) return res.status(400).send('ID inválido');

            const userId = req.session.userId;
            if (!userId) return res.status(401).send('Usuário não autenticado');

            const pacote = await Pacote.findOne({ where: { id, userId: userId }, raw: true });

            if (pacote) {
                res.render('detalhes', { pacote });
            } else {
                res.status(404).send('Pacote não encontrado');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro ao buscar detalhes do pacote');
        }
    }
}