const express = require('express');
const router = express.Router();
const Book = require('../models/book.model.js');


// MIDDLEWARE
const getBook = async (req, res, next) => {
    let book;
    const { id } = req.params;

    // Validacion de url, tipico ID DE MONGO
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json({
            message: 'El ID del libro no es válido'
        })
    }

    try {
        book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({
                message: 'El libro no fue encontrado'
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }

    res.book = book;
    next()
}

// Obtener todos los libros [GET ALL]
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        console.log("GET ALL", books);
        if (books.length === 0) {
            res.status(204).json([])
        }
        res.json(books)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Crea un nuevo libro (recurso) [POST]
router.post('/', async (req, res) => {
    const { title, autor, genre, publication_date } = req?.body
    if (!title || !autor || !genre || !publication_date) {
        return res.status(400).json({
            message: 'Los cambios titulo, autor, genero y fecha son obligatorios'
        })
    }

    const book = new Book(
        {
            title,
            autor,
            genre,
            publication_date
        }
    )

    try {
        const newBook = await book.save()
        console.log(newBook)
        res.status(201).json(newBook)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

// Get individual
router.get('/:id', getBook, async (req, res)=>{
    res.json(res.book); 
})

// Para actualizar o sustituir todo el recurso
router.put('/:id', getBook, async(req, res)=>{
    try {
        const book = res.book;
        book.title = req.body.title || book.title;
        book.autor = req.body.autor || book.autor;
        book.genre = req.body.genre || book.genre;
        book.publication_date = req.body.publication_date || book.publication_date;

        const updateBook = await book.save()
        res.json(updateBook);

    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

// Se utilizar para actualizar una parte del recurso o solo algunas propiedades clave valor
router.patch('/:id', getBook, async(req, res)=>{
    if (!req.body.title && !req.body.autor && !req.body.genre && !req.body.publication_date) {
        res.status(400).json({
            message: 'Al menos uno de estos campos debe ser enviado: Título, Autor, Genero '
        })
    }

    try {
        const book = res.book;
        book.title = req.body.title || book.title;
        book.autor = req.body.autor || book.autor;
        book.genre = req.body.genre || book.genre;
        book.publication_date = req.body.publication_date || book.publication_date;

        const updateBook = await book.save()
        res.json(updateBook);

    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

// Eliminar 
// Get individual
router.delete('/:id', getBook, async (req, res)=>{
    try {
        const book = res.book;
        await book.deleteOne({
            _id:book._id
        });

        res.json({
            message: `El libro ${book.title} fue eliminado correctamente.`
        });

    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    } 
})


module.exports = router