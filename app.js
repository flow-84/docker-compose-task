// import benoetigte module
const express = require('express');
const app = express();
const mysql = require('mysql2');

// http-server verbindungs parameter
const port = 3000;

// create the connection to database
const connection = mysql.createConnection({
    host: 'database',
    user: 'example-user',
    password: 'my_cool_secret',
    database: 'restaurants'
});

// db table creation string
connection.query('CREATE TABLE IF NOT EXISTS restaurants (id INTEGER PRIMARY KEY AUTO_INCREMENT, name TEXT NOT NULL)');

// middleware aktivieren
app.use(express.json());

/* API ENDPUNKTE */

// alle restaurants abfragen
app.get('/restaurants', (_, res) => {
    // log request received
    let date_ob = new Date();
    console.log(date_ob.toISOString() + " GET all restaurants");

    // db abfrage alle restaurants
    let result = connection.execute('SELECT * FROM restaurants',
        function (err, results, _) {
            if (err) throw err;
            res.send(results);
        });
});

// bestimmtes restaurant abfragen
app.get('/restaurant/:name', (req, res) => {
    // log request received
    let date_ob = new Date();
    console.log(date_ob.toISOString() + " GET " + req.params.name);

    // db abfrage einzelnes restaurant
    let result = connection.execute('SELECT * FROM restaurants WHERE name = ?', [req.params.name],
        function (err, results, _) {
            if (err) throw err;

            res.status(404);
            res.send({ "message": "Restaurant nicht gefunden!" });
            // gib ergebnis der suche zurück
            if (results.length <= 0) {
                res.status(404);
                res.send({ "message": "Restaurant nicht gefunden!" });
            } else {
                res.send(results);
            }
        });
});

// neues restaurant hinzufügen
app.post('/restaurant', (req, res) => {
    // log request received
    let date_ob = new Date();
    console.log(date_ob.toISOString() + " POST " + req.body.name);

    let r = req.body;
    // prüfe, ob alle erforderlichen daten vorhanden sind
    if (!r.name) {
        res.status(400);
        res.send({ "message": "bitte name angeben!" });
    } else {
        // prüfe, ob element bereits in datenbank
        let result = connection.execute('SELECT * FROM restaurants WHERE name = ?', [r.name],
            function (err, results, _) {
                if (err) throw err;
                if (results.length <= 0) {
                    // nicht vorhanden, füge restaurant hinzu
                    connection.execute('INSERT INTO restaurants (name) VALUES(?)',[r.name],
                    function (err, _, _) {
                        if (err) throw err;
                        res.status(201);
                        res.send({ "message": "Restaurant hinzugefügt: " + r.name });
                    });
                } else {
                    // restaurant bereits vorhanden
                    res.status(409);
                    res.send({ "message": "Restaurant bereits vorhanden: " + r.name });
                }

            });
    }
});

// bestimmtes restaurant aktualisieren
app.put('/restaurant/:name', (req, res) => {
    //TODO: implement
});

// bestimmtes restaurant loeschen
app.delete('/restaurant/:name', (req, res) => {
    //TODO: implement
});

// server starten
app.listen(port, '', () => {
    console.log(`Server gestartet auf Port ${port}.`);
});

// verbindung zur datenbank trennen
process.on('SIGINT', () => {
    connection.close();
    console.log("verbindung zur datenbank getrennt.");
    process.exit();
});
