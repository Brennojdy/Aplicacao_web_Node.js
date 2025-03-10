var objectId = require('mongodb').ObjectId;

function jogoDAO(connection){
    this._connection = connection();
}

jogoDAO.prototype.gerarParametros = function(usuario){
    this._connection.open(function(err, mongoclient){
        mongoclient.collection('jogo', function(err, collection){
            collection.insert({
                usuario: usuario,
                moeda: 15,
                suditos: 10,
                temor: Math.floor(Math.random()*1000),
                sabedoria: Math.floor(Math.random()*1000),
                comercio: Math.floor(Math.random()*1000),
                magia: Math.floor(Math.random()*1000)
            });

            mongoclient.close();
        });
    });
};

jogoDAO.prototype.iniciaJogo = function(usuario, res, casa, msg){
    this._connection.open(function(err, mongoclient){
        mongoclient.collection('jogo', function(err, collection){
            collection.find({usuario: usuario}).toArray(function(err, result){
                
                res.render('jogo', {img_casa: casa, jogo: result[0], msg: msg, termina_em: usuario.termina_em});               

                mongoclient.close();
            });
            
        });

    });
    
};

jogoDAO.prototype.acao = function(acao){
    this._connection.open(function(err, mongoclient){
        mongoclient.collection('acao', function(err, collection){
            
            var date = new Date();

            var tempo = null

            switch(parseInt(acao.acao)){
                case 1: tempo = 1 * 60 * 60000; break;
                case 2: tempo = 2 * 60 * 60000; break;
                case 3: tempo = 5 * 60 * 60000; break;
                case 4: tempo = 5 * 60 * 60000; break;
            }

            acao.termina_em =  date.getTime() + tempo;
            
            collection.insert(acao);          
        });
    

        mongoclient.collection('jogo', function(err, collection){
           
            var moedas = null
            
            switch(parseInt(acao.acao)){
                case 1: moedas = -2 * acao.quantidade; break;
                case 2: moedas = -3 * acao.quantidade; break;
                case 3: moedas = -1 * acao.quantidade; break;
                case 4: moedas = -1 * acao.quantidade; break;
            }
            collection.update(
                {usuario: acao.usuario},
                {$inc: {moeda: moedas}}
            );

            mongoclient.close();
        });

    });
    
}

jogoDAO.prototype.getAcoes = function(usuario, res){
    this._connection.open(function(err, mongoclient){
        mongoclient.collection('acao', function(err, collection){
            var date = new Date();
            var momento_atual = date.getTime();
            collection.find({usuario: usuario, termina_em: {$gt: momento_atual}}).toArray(function(err, result){ 
                console.log(result[0])
                res.render('pergaminhos', {acoes: result});
                
                mongoclient.close();
            });
            
        });

    });

    
    
    
};

jogoDAO.prototype.revogarAcao = function(id, res){
    this._connection.open(function(err, mongoclient){
        mongoclient.collection('acao', function(err, collection){
            console.log('revogarAcao id = ' + id)
            collection.remove(
                {_id: objectId(id)},
                function(err, result){
                    res.redirect('jogo?msg=D')
                    mongoclient.close();
                }             
            );
            
        })
   })
}

module.exports = function(){
    return jogoDAO;
};