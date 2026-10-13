"use strict";

const express = require('express');
const path = require('path');
const Printer = require('../printer.js');

const app = express();

app.get('/printer.js', (req, res) => res.sendFile(path.join(__dirname, '..', 'printer.js')));
app.use('/', express.static(path.join(__dirname, 'public')));

app.listen(8080, () => {
    console.log('\n');
    new Printer('mean stack', '#', ' ').write().print();
    console.log('\nopen http://localhost:8080 and check the browser console\n');
});

module.exports = app;
