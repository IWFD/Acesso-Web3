const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

let grupos = [];
let usuariosRemovidos = [];
const maxGrupos = 6;
const maxUsuariosPorGrupo = 5;
const dbFile = 'bd.json';

// Carregar dados do arquivo JSON ao iniciar o servidor
if (fs.existsSync(dbFile)) {
    try {
        const data = fs.readFileSync(dbFile);
        const parsedData = JSON.parse(data);
        grupos = parsedData.grupos || [];
        usuariosRemovidos = parsedData.usuariosRemovidos || [];
    } catch (error) {
        console.error('Erro ao carregar dados do arquivo:', error);
    }
}

// Função para salvar dados no arquivo JSON
function salvarDados() {
    try {
        fs.writeFileSync(dbFile, JSON.stringify({ grupos, usuariosRemovidos }, null, 2));
    } catch (error) {
        console.error('Erro ao salvar dados no arquivo:', error);
    }
}

// Rota para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para cadastrar usuário
app.post('/cadastrar', (req, res) => {
    const { nome, telefone, cpf } = req.body;

    if (!nome || !telefone || !cpf) {
        console.log('Tentativa de cadastro com dados incompletos:', req.body);
        return res.status(400).send('Todos os campos são obrigatórios');
    }

    const dataHora = new Date().toLocaleString();
    const usuario = { nome, telefone, cpf, dataHora, pago: false };

    let grupoAtual = grupos[grupos.length - 1];

    if (!grupoAtual || grupoAtual.length >= maxUsuariosPorGrupo) {
        if (grupos.length >= maxGrupos) {
            const grupoRemovido = grupos.shift();
            grupoRemovido.forEach(u => u.pago = true);
            usuariosRemovidos.push(...grupoRemovido);
        }
        grupoAtual = [];
        grupos.push(grupoAtual);
    }

    grupoAtual.push(usuario);
    salvarDados();
    console.log('Usuário cadastrado:', usuario);
    res.status(201).send('Usuário cadastrado com sucesso');
});

// Rota para obter grupos
app.get('/grupos', (req, res) => {
    res.json(grupos);
});

// Rota para obter o "Grupo Nióbio"
app.get('/grupo-niobio', (req, res) => {
    res.json(usuariosRemovidos);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
