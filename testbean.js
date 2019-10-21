var express  = require('express');
var app      = express();
var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer();
var serverOne = 'http://220.227.2.106:8010/Service/TPSLNotify.aspx?pgid=6&d=1';
 
app.all("/", function(req, res) {
    console.log('redirecting to Server1');
    apiProxy.web(req, res, {target: serverOne});
});

app.listen(process.env.PORT||9879);