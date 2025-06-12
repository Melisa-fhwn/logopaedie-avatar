import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json());

const WEBUI_URL = 'https://projekt1.kgmvp.com';  // Dein WebUI Server

app.post('/chat', async (req, res) => {
  try {
    const response = await fetch(`${WEBUI_URL}/api/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFlYWUwY2Y3LWU0MzAtNGY2OS04MjIwLTYyYWNjNGE1YmY0MiJ9.puhsZOn4eZkitutJq4N9xrUMn6i6qac5OLl0TcZvTH4'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy Fehler:', error);
    res.status(500).json({ error: 'Fehler beim Weiterleiten an WebUI' });
  }
});

app.listen(5000, () => {
  console.log('Proxy läuft auf http://localhost:5000');
});
