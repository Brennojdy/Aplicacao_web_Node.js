const { application } = require("express");

module.exports.index = function(application, req, res){
    
    var msg = ''

    msg = req.query.msg

    if(msg != ''){
        msg = req.query.msg
    }

    res.render('index', {validacao: {}, login: {}, msg: msg});
}

module.exports.autenticar = function(application, req, res){
     
    var dadosForm = req.body

    req.assert('usuario', 'Usuario não pode ser vazio').notEmpty();
    req.assert('senha', 'Senha não pode ser vazio').notEmpty();

    var erros = req.validationErrors();

    if(erros){
        res.render('index', {validacao: erros, login: dadosForm, msg: {}})
        return
    }
    
    var connection = application.config.dbConnection;
    var usuariosDAO = new application.app.models.UsuariosDAO(connection);

    usuariosDAO.autenticar(dadosForm, req, res)
}