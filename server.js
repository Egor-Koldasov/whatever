// @flow
const express = require('express');

const app = express();

app.use(express.static('static'));
app.use(express.static('dist'));
app.listen(4000, () => console.log('go'));
