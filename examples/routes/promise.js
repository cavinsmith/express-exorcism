/* eslint-disable */
var express = require('express');
var router = express.Router();

router.get('/', async (req, res) => {
  return 'Promise OK'
})

router.get('/error', async (req, res) => {
  throw new Error('Promise OK (error variant)')
})

module.exports =router
