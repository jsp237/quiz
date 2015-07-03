var path = require('path');

//Postgres DATABASE_URL = postgres://user:passwd@host:port/database
//SQLite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6] || null);
var user = (url[2] || null);
var pwd = (url[3] || null);
var protocol = (url[1] || null);
var dialect = (url[1] || null);
var port = (url[5] || null);
var host = (url[4] || null);
var storage = process.env.DATABASE_STORAGE;

//Cargar Modelo ORM
var Sequelize = require('sequelize');

//Usar BD SQLite o Postgresql
var sequelize = new Sequelize(DB_name, user, pwd,
	{dialect: protocol,
	 protocolo: protocol,
	 port: port,
	 host: host,
	 storage: storage, //Solo Sqlite (.env)
	 omitNull: true //Solo Postgresql
	}
);

//Importar la definición de la tabla 'Quiz' definida en 'quiz.js'
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

//Exportar definición de la tabla Quiz
exports.Quiz = Quiz;

//sequelize.sync() crea e inicializa la tabla de preguntas en la BD
sequelize.sync().then(function(){

	//then(...) ejecuta el manejador una vez creada la tabla.
	Quiz.count().then(function(count){

		//La tabla se inicializa solo si está vacía
		if(count === 0){ 

			Quiz.create({ pregunta: 'Capital de Italia',
						  respuesta: 'Roma'
						})
			
			Quiz.create({ pregunta: 'Capital de Portugal',
						  respuesta: 'Lisboa'
						})

			Quiz.create({ pregunta: 'Capital de España',
						  respuesta: 'Madrid'
						})

			.then(function(){
				console.log('Base de datos inicializada')});
		};
	});
});