var express  = require('express');
var app      = express();
var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer();
var serverOne = 'http://220.227.2.106:14489/Service/TPSLNotify.aspx?pgid=7';
 
app.all('/', function(req, res) {
try
{
    apiProxy.web(req, res, {target: serverOne});
	}
	 catch(err) {
    res.write(err);
	res.end;
  }
});
app.listen(process.env.PORT||3000);