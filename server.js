const express = require('express');

const app = express(),
  staticServe = express.static(`${__dirname}/dist`)

// catch all
app.use('/', staticServe);
app.use('*', staticServe);

const port = 3000;
app.listen(port, function () {
  console.log('Listening on port 3000!');
});
