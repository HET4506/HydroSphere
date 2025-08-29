require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sitesRouter = require('./routes/sites');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

// health
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// sites routes
app.use('/api/sites', sitesRouter);

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`GreenH2 backend running on http://localhost:${PORT}`);
});
