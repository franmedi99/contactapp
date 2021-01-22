const express = require('express');
const { isNotLoggedIn } = require('../lib/auth');
const { route } = require('./authentication');
const router = express.Router();

router.get('/',isNotLoggedIn, async (req, res) => {
    res.render('index');
});


module.exports = router;