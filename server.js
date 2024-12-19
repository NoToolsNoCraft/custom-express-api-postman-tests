const express = require("express");
const app = express();

// Middleware to parse JSON request body
app.use(express.json());

// Mock data
let books = [
    {
       "id": 1,
       "name": "True Love",
       "type": "non-fiction",
       "available": false
    },
    {
       "id": 5,
       "name": "Real Trouble",
       "type": "fiction",
       "available": true
    },
    {
       "id": 8,
       "name": "CSI Miami",
       "type": "fiction",
       "available": true
    }
];

// GET request
app.get("/", (req, res) => {
    console.log('GET request received.');
    res.status(200).json(books);
});

// POST request
app.post("/update", (req, res) => {
    const updates = Array.isArray(req.body) ? req.body : [req.body]; // Normalize input to an array

    const updatedBooks = [];
    const addedBooks = [];

    updates.forEach(update => {
        const { id, name, type, available } = update;

        // Validation: Ensure an ID is provided
        if (id === undefined) {
            return res.status(400).json({
                message: "ID is required to add or update a book."
            });
        }

        // Find the book by ID
        const bookIndex = books.findIndex(book => book.id === id);

        if (bookIndex !== -1) {
            // Book exists: update its properties
            if (name !== undefined) books[bookIndex].name = name;
            if (type !== undefined) books[bookIndex].type = type;
            if (available !== undefined) books[bookIndex].available = available;

            updatedBooks.push({ ...books[bookIndex] });
        } else {
            // Book doesn't exist: add it as a new book
            const newBook = { id, name, type, available };
            books.push(newBook);
            addedBooks.push(newBook);
        }
    });

    res.status(200).json({
        message: "Books processed successfully",
        updatedBooks: updatedBooks.length > 0 ? updatedBooks : undefined,
        addedBooks: addedBooks.length > 0 ? addedBooks : undefined
    });
});


// PUT request to update book data
app.put("/update/:id", (req, res) => {
    const bookId = parseInt(req.params.id); // Extract book ID from URL
    const { name, type, available } = req.body;

    // Find the book by ID
    const book = books.find(book => book.id === bookId);

    if (book) {
        // Update book properties if provided
        if (name !== undefined) book.name = name;
        if (type !== undefined) book.type = type;
        if (available !== undefined) book.available = available;

        res.status(200).json({
            message: "Book updated successfully",
            updatedBook: book
        });
    } else {
        res.status(404).json({
            message: "Book not found"
        });
    }
});

// DELETE request to remove a book by ID
app.delete("/delete/:id", (req, res) => {
    const bookId = parseInt(req.params.id); // Extract book ID from URL

    // Find the index of the book
    const bookIndex = books.findIndex(book => book.id === bookId);

    if (bookIndex !== -1) {
        // Remove the book from the array
        const deletedBook = books.splice(bookIndex, 1);

        res.status(200).json({
            message: "Book deleted successfully",
            deletedBook: deletedBook[0]
        });
    } else {
        res.status(404).json({
            message: "Book not found"
        });
    }
});

// Start server
app.listen(3005, () => {
    console.log('Server running on port 3005');
});
