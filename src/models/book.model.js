const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
    {
        title: String,
        autor: String,
        genre: String,
        publication_date: String,
    }
)


console.log( "Book models" );
module.exports = mongoose.model('Book', bookSchema)