require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());

// Example route for APOD
app.get('/api/apod', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch APOD', error: error.message });
  }
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
