const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Placeholder endpoint
app.get('/', (req, res) => res.send('API Running'));
app.listen(4000, () => console.log('Backend running on port 4000'));
