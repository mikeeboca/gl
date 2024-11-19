const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const data = JSON.parse(body);
            const guest = { name: data.name, email: data.email };
            const filePath = path.join(process.cwd(), 'guests.json');

            fs.readFile(filePath, (err, fileData) => {
                let guests = [];
                if (!err) {
                    guests = JSON.parse(fileData || '[]');
                }
                guests.push(guest);

                fs.writeFile(filePath, JSON.stringify(guests, null, 2), err => {
                    if (err) {
                        return res.status(500).json({ error: 'Speichern fehlgeschlagen' });
                    }
                    res.status(200).json({ message: 'Erfolgreich eingetragen!' });
                });
            });
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};
