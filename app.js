const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const offerRoutes = require('./routes/offer');
const leadsRoutes = require('./routes/leads');
const scoreRoutes = require('./routes/score');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/offer', offerRoutes);
app.use('/leads', leadsRoutes);
app.use('/score', scoreRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
