var express = require('express'),
    app = express(),
    fs = require('fs');

// carregar "banco de dados" (data/jogadores.json e data/jogosPorJogador.json)
// você pode colocar o conteúdo dos arquivos json no objeto "db" logo abaixo
// dica: 3-4 linhas de código (você deve usar o módulo de filesystem (fs))
let { players } = JSON.parse(fs.readFileSync('server/data/jogadores.json', 'utf8'))
let games = JSON.parse(fs.readFileSync('server/data/jogosPorJogador.json', 'utf8'))

var db = {
    players,
    games
};

// configurar qual templating engine usar. Sugestão: hbs (handlebars)
app.set('view engine', 'hbs');
app.set('views', 'server/views');

// EXERCÍCIO 2
// definir rota para página inicial --> renderizar a view index, usando os
// dados do banco de dados "data/jogadores.json" com a lista de jogadores
// dica: o handler desta função é bem simples - basta passar para o template
//       os dados do arquivo data/jogadores.json
app.get('/', (request, response) => {
    response.render('index', db)
})


// EXERCÍCIO 3
// definir rota para página de detalhes de um jogador --> renderizar a view
// jogador, usando os dados do banco de dados "data/jogadores.json" e
// "data/jogosPorJogador.json", assim como alguns campos calculados
// dica: o handler desta função pode chegar a ter umas 15 linhas de código
app.get('/jogador/:numero_identificador/', (request, response) => {
    let gamesByPlayer = db.games[request.params.numero_identificador]
    gamesByPlayer.not_played = gamesByPlayer.not_played || gamesByPlayer.games.filter(game => game.playtime_forever == 0).length
    gamesByPlayer.games = gamesByPlayer.games
        .sort((a, b) => a.playtime_forever < b.playtime_forever ? 1 : -1)
        .slice(0, 5)
        .map((game) => {
            game.playtime_hours = Math.floor(game.playtime_forever / 60)
            return game
        })
    gamesByPlayer.favorite = gamesByPlayer.games[0]
    response.render('jogador', {
        player: db.players.find(player => player.steamid == request.params.numero_identificador),
        gamesByPlayer
    })
})

// EXERCÍCIO 1
// configurar para servir os arquivos estáticos da pasta "client"
// dica: 1 linha de código
app.use(express.static('client'))
// abrir servidor na porta 3000
// dica: 1-3 linhas de código
app.listen(3000, () => {
    console.log('Servidor escutando - porta ' + 3000)
})