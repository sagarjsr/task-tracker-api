const mongoose = require('mongoose');
const app = require('./config/express');

require('dotenv').config();

// MongoDB Initialization

mongoose
  .connect(process.env.DB_URL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    // Port
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Listening on port ${port}...`));

  })
  .catch(err => {
    console.log('Could not connect to MongoDB.');
    process.exit();
  });

