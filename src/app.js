const express = require('express');
const mongoose = require('mongoose'); 
const bodyParser = require('body-parser');
const {config} = require('dotenv');
config();

const bookRoutes = require('./routes/book.routes.js')

// Usamos express para los middlewares
const app = express();
// Para que parsee el body que se recibe
app.use(bodyParser.json());

// Conectaremos la base de datos
mongoose.connect(process.env.MONGO_URL, {dbName: process.env.MONGO_DB_NAME})
const db = mongoose.connection;

app.use('/books', bookRoutes);

const port = process.env.PORT || 3000

app.listen(port, ()=>{
    console.log( `Servidor inicializadon en el puerto ${port}` );
})