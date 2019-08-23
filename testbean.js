var express  = require('express');
var app      = express();
var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer();
var serverOne = 'http://220.227.2.106:14489/Service/TPSLNotify.aspx?pgid=7',
    ServerTwo = 'http://220.227.2.106:14489/Service/TPSLNotify.aspx?pgid=7',
    ServerThree = 'http://220.227.2.106:14489/Service/TPSLNotify.aspx?pgid=7';
 
app.all("/", function(req, res) {
    console.log('redirecting to Server1');
    apiProxy.web(req, res, {target: serverOne});
});

/*app.all("/app2/*", function(req, res) {
    console.log('redirecting to Server2');
    apiProxy.web(req, res, {target: ServerTwo});
});

app.all("/app2/*", function(req, res) {
    console.log('redirecting to Server3');
    apiProxy.web(req, res, {target: ServerThree});
});*/

app.listen(process.env.PORT||9879);