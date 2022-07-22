// Importando o Express e o Express-handlebars
const express = require("express");


// Craindo o objeto app pra criar as rotas e ter acesso ao servidor
const app = express();

const path = require('path'); //enderço de cada rota
const router = express.Router(); // trabalha com as rotas
const moment = require('moment');

// Cria as rotas para o servidor
const Cadastro = require("./models/Cadastro");

// Template
const handlebars = require("express-handlebars");
app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
    helpers: {
        formatDate: (date) => {
            return moment(date).format('DD/MM/YYYY')
        }
    }
}));
/*app.engine('handlebars', handlebars({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
    helpers: {
        formatDate: (date) => {
            return moment(date).format('DD/MM/YYYY')
        }
    }
}));*/
app.set('view engine', 'handlebars')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Rotas para as paginas

router.get('/', function(req, res) {
    res.render('index');
})

router.get('/cadastro', function(req, res) {
    res.sendFile(path.join(__dirname + '/cadastro.html'));
});

router.get('/about', function(req, res) {
    res.sendFile(path.join(__dirname + '/about.html'));
});

// Rotas para criar cadastro

router.post('/cadastro', function(req, res) {
    Cadastro.create({
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha
    }).then(function() {
        res.sendFile(path.join(__dirname + '/cadastroEfetuado.html'));
    }).catch(function(erro) {
        res.send("Erro: Cliente não foi cadastrado com sucesso!" + erro)
    })
});

// Rotas para criar a lista de clientes

router.get('/listaCliente', function(req, res) {
    Cadastro.findAll().then(function(cadastros) {
        res.render('listaCliente', { cadastros: cadastros });
    })
});

// Rotas para deletar um cadastro

router.get('/del-cadastro/:id', function(req, res) {
    Cadastro.destroy({
        where: { 'id': req.params.id }
    }).then(function() {
        res.redirect('/');
        //res.send("Cadastro apagado com sucesso!");
    }).catch(function(erro) {
        res.send("Cadastro não apagado com sucesso!");
    })
});

// Rotas para editar um cadastro

router.get('/edit-cadastro/:id', function(req, res) {
    Cadastro.findByPk(req.params.id).then(function(cadastros) {
        res.render('editarUser', { cadastros: cadastros });
    })
});

router.post('/edit-cadastro/:id', function(req, res) {
    Cadastro.update({
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha
    }, { where: { 'id': req.params.id } }).then(function() {
        res.redirect('/listaCliente')

    }).catch(function(erro) {
        res.send("Erro: Cadastro não foi editado com sucesso!" + erro)
    })

});

app.use('/', router); //index
app.use('/cadastro', router);
app.use('/about', router);
app.use('/listaCliente', router);
app.use('/del-cadastro/:id', router);
app.use('/edit-cadastro/:id', router);

// Servidor
app.listen(8080);