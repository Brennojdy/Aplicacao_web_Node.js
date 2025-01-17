const { application } = require("express");

module.exports.cadastro = function(application, req, res){

    var msg = ''

    var msg = req.query.msg

    if (msg != ''){
        msg = req.query.msg
    }

    res.render('cadastro', {validacao: {}, dados: {}, msg: msg} );
}

module.exports.cadastrar = function(application, req, res){
    var dadosForm = req.body;

    req.assert('nome', 'Nome não pode ser vazio').notEmpty();
    req.assert('usuario', 'Usuário não pode ser vazio').notEmpty();
    req.assert('senha', 'Senha não pode ser vazio').notEmpty();
    req.assert('casa', 'Casa não pode ser vazio').notEmpty();

    var erros = req.validationErrors();

    if(erros){
        res.render('cadastro', {validacao: erros, dados: dadosForm});
        return
    }

    var connection = application.config.dbConnection;
    var UsuariosDAO = new application.app.models.UsuariosDAO(connection);
    var jogoDAO = new application.app.models.jogoDAO(connection)

    //geração dos parametros
    UsuariosDAO.inserirUsuario(dadosForm, res)
    jogoDAO.gerarParametros(dadosForm.usuario)

};