const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Route für das Formular
app.post('/submit', (req, res) => {
    const { name, email } = req.body;

    if (name && email) {
        const guest = { name, email };
        const dataPath = './guests.json';

        // Gäste speichern
        fs.readFile(dataPath, (err, data) => {
            let guests = [];
            if (!err) {
                guests = JSON.parse(data || '[]');
            }
            guests.push(guest);
            fs.writeFile(dataPath, JSON.stringify(guests, null, 2), (err) => {
                if (err) {
                    console.error('Fehler beim Speichern:', err);
                    return res.status(500).send('Ein Fehler ist aufgetreten.');
                }
                res.send('<h1>Danke für deine Anmeldung!</h1>');
            });
        });
    } else {
        res.status(400).send('Name und E-Mail sind erforderlich!');
    }
});

// Start des Servers
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});

