/*
 * This is express router to support leagues section at server 
 *
 */
const express = require('express');
const leaguesRouter = express.Router();
const fs = require('fs');

/* GET leagues page. */
leaguesRouter.get('/', function(req, res, next) {
    res.render('leagues', { title: 'leagues' });
});


/* Get leagues data for display */
leaguesRouter.get('/data', function(request, response) {
    // set Content-Type for JSON
    response.setHeader('Content-Type', 'application/json');
    response.end(fs.readFileSync('./data/leagues.json'));
});

module.exports = leaguesRouter;