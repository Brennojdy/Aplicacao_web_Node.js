function UsuariosDAO(connection){
    this._connection = connection();
}

UsuariosDAO.prototype.inserirUsuario = function(usuario, res){
    //função open espera 1 parrâmetro: a função de callback
    //a função de callback espera 2 parâmetros: erros e o objeto de conexão com o bd, no caso mongoclient
    this._connection.open(function(err, mongoclient){
    
    //a função collection espera dois parâmetros para realizar as tratativas no bd: O primeiro é o nome da collection. O segundo é uma função de callback (é a tomada de ação após as tratativas)

    //Já a função de callback também recebe dois parâmetros: o primeiro é o de erro, o segundo é o objeto que vai permitir fazer a manipulação dos documentos dentro da collection
        mongoclient.collection('usuarios', function(err, collection){
            console.log(usuario);
            
            collection.insert(usuario)
                res.redirect('cadastro?msg=ok')
                mongoclient.close();
        });
    });

}

UsuariosDAO.prototype.autenticar = function(usuario, req, res){
    this._connection.open(function(err, mongoclient){
        mongoclient.collection('usuarios', function(err, collection){
            collection.find(usuario).toArray(function(err, result){
               
                if (result[0] != undefined){
                    //autorizado é a variável de sessão criada pelo express-session
                    req.session.autorizado = true
                    
                    req.session.usuario = result[0].usuario
                    req.session.casa = result[0].casa

                    res.redirect('jogo')
                }else{
                    res.redirect('/?msg=N')
                }
                
                 

            });
            mongoclient.close();
        })
    })
}

module.exports = function(){
   return UsuariosDAO;
}





