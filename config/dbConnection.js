var mongo = require('mongodb');

var connMongoDB = function(){
    //instanciar a classe de conexão
    //espera três parâmetros: 'nome do db' (string), objeto de conexão(parâmetros básicos para a conexão esperado como objeto)
    //uma instância é um objeto
    var db = new mongo.Db(
        'got',

        //esse objeto espera outros três parâmetros
        new mongo.Server(
            'localhost', //string contendo o endereço onde está o banco de dados 
            27017, //porta de conexão
            {} //objetos de config do servidor
        ),
        {} //objetos de config do servidor
    )

    return db;
}

module.exports = function(){
    return connMongoDB;
}




