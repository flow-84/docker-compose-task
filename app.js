const express = require('express');
const app = express();
const mysql = require('mysql2');

const port = 3000;

// Create a connection pool
const pool = mysql.createPool({
    host: 'db',
    user: 'example-user',
    password: 'my_cool_secret',
    database: 'restaurants'
});

// Enable JSON parsing middleware
app.use(express.json());
// Root-Endpunkt
app.get('/', (_, res) => {
    res.send('Willkommen zum Restaurant-API!');
});

// Get all restaurants
app.get('/restaurants', (_, res) => {
    pool.query('SELECT * FROM restaurants', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Get a specific restaurant
app.get('/restaurant/:name', (req, res) => {
    pool.query('SELECT * FROM restaurants WHERE name = ?', [req.params.name], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Restaurant not found' });
        res.json(results);
    });
});

// Add a new restaurant
app.post('/restaurant', (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Please provide a name' });

    pool.query('INSERT INTO restaurants (name) VALUES (?)', [name], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: `Restaurant added: ${name}` });
    });
});

// Update a specific restaurant
app.put('/restaurant/:name', (req, res) => {
    // TODO: Implement
});

// Delete a specific restaurant
app.delete('/restaurant/:name', (req, res) => {
    // TODO: Implement
});

// Error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    pool.end(() => {
        console.log('Database connection closed.');
        server.close(() => {
            console.log('Server closed.');
            process.exit();
        });
    });
});
