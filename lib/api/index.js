var express = require('express');
var router = express.Router();

/* GET main page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Manage ToDo' });
});

module.exports = router;