var express = require("express");
var promClient = require('prom-client');

var app = express();

const counter = new promClient.Counter({
    name: 'request_total',
    help: 'Request counter',
    labelNames: ['statusCode'],
});

const histogram = new promClient.Histogram({
    name: 'request_time_seconds',
    help: 'Request time seconds',
    buckets: [0.1, 0.2, 0.3, 0.4, 0.5]
});

app.get('/metrics', async function (req, res) {
    res.set('Content-Type', promClient.register.contentType);
    res.end(await promClient.register.metrics());
});

app.get('/', function (req, res) {
    counter.inc(); // Increment by 1
    counter.labels('200').inc();
    histogram.observe(Math.random());

    res.send('Hello world');
});

app.listen(3000);