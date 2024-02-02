const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

// Your Supabase URL and API Key
const SUPABASE_URL = 'https://tkmthnhmpgonqiwlgjvu.supabase.co';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrbXRobmhtcGdvbnFpd2xnanZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNTYzMDY1NCwiZXhwIjoyMDIxMjA2NjU0fQ.CObGyh7HF9Enpfm3iGX1IM7k0QQjOqwjP2uNPgrguQ8';

app.use(express.json());

// GET request to fetch data from Supabase
app.get('/getData', async (req, res) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/hazards`, {
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_API_KEY,
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST request to insert data into Supabase
app.post('/insertData', async (req, res) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/hazards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_API_KEY,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});