const express = require('express');
const jwt = require('jsonwebtoken');


const app = express();

let token = jwt.sign({ user: 'steven' }, 'secret');

var decoded = jwt.verify(token, 'secret');
console.log(decoded.user);


