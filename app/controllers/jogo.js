const { application } = require("express");

module.exports.jogo = function(application, req, res){
    
    if(req.session.autorizado !== true){
        res.send('O usuário precisa fazer login');
        return;
    } 

    var msg = ''
    
    if(req.query.msg != ''){
        msg = req.query.msg;
    }
    
    var usuario = req.session.usuario
    var casa = req.session.casa

    var connection = application.config.dbConnection;
    var jogoDAO = new application.app.models.jogoDAO(connection)

    jogoDAO.iniciaJogo(usuario, res, casa, msg);

}

module.exports.sair = function(application, req, res){
    req.session.destroy(function(err){
         res.render('index', {validacao: {}, login: {}, msg: {}})
    });    
}

module.exports.suditos = function(application, req, res){
    if(req.session.autorizado !== true){
        res.send('O usuário precisa fazer login');
        return;
    } 
    res.render('suditos', {validacao: {}});
};

module.exports.pergaminhos = function(application, req, res){
    if(req.session.autorizado !== true){
        res.send('O usuário precisa fazer login');
        return;
    } 

    //recurepar acoes inseridas no banco de dados
    var usuario = req.session.usuario

    var connection = application.config.dbConnection
    var jogoDAO = new application.app.models.jogoDAO(connection)

    jogoDAO.getAcoes(usuario, res)
};



module.exports.ordenar_acao_sudito = function(application, req, res){
    if(req.session.autorizado !== true){
        res.send('O usuário precisa fazer login');
        return;
    } 

    var dadosForm = req.body    

    req.assert('acao', 'Ação deve ser informada').notEmpty();
    req.assert('quantidade', 'Quantidade deve ser informada').notEmpty();

    var erros = req.validationErrors();

    if(erros){
        res.redirect('jogo?msg=A');
        return
    }

    

    var connection = application.config.dbConnection;
    var jogoDAO = new application.app.models.jogoDAO(connection)

    dadosForm.usuario = req.session.usuario;
    jogoDAO.acao(dadosForm);

    res.redirect('jogo?msg=B')

};

module.exports.revogar_acao = function(application, req, res){
    var url_query = req.query;

    var connection = application.config.dbConnection
    var jogoDAO = new application.app.models.jogoDAO(connection)

    var _id = url_query.id_acao

    jogoDAO.revogarAcao(_id, res);

}