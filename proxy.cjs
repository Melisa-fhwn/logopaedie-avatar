const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Deine WebUI API-Daten
const WEBUI_URL = 'https://projekt1.kgmvp.com/api/chat';
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFlYWUwY2Y3LWU0MzAtNGY2OS04MjIwLTYyYWNjNGE1YmY0MiJ9.puhsZOn4eZkitutJq4N9xrUMn6i6qac5OLl0TcZvTH4';

app.post('/chat', async (req, res) => {
    try {
        const response = await fetch(WEBUI_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JWT_TOKEN}`
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Proxy-Fehler');
    }
});

app.listen(5000, () => {
    console.log('Proxy läuft auf http://localhost:5000');
});
