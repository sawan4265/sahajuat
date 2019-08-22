const express = require("express");
const bodyParser = require("body-parser");
var request = require('request');
var app = express();
var fs =require('fs');
const alexaVerifier = require('alexa-verifier');
app.use(
		bodyParser.urlencoded(
		{ extended: true })
	);
app.use(bodyParser.json());

function requestVerifier(req, res, next) {

  alexaVerifier(
    req.headers.signaturecertchainurl,
    req.headers.signature,
    req.rawBody,
    function verificationCallback(err) {
      if (err) {
        res.status(401).json({
          message: 'Verification Failure',
          error: err
        });
      } else {
        next();
      }
    }
  );
}
app.get('/',function(req,res){
  request.get({"url":'http://220.227.2.106:14489/Service/TPSLNotify.aspx?pgid=7&msg=hxROstvSU1gmvci7lxlr2RuVjrSPAPI8SYW0smAytdjfk5k6N3DnnGzuzGH3Gp175Db9gkqeSusIMRBTQqq79PXzuNV+tj0VTA80mHgd89s3yTxdGT/VGTjYNVCLSYYvVY+z40AifBgMINsaLce+rPZ5wFYvwdwM2kKISYwwTk9OsXX18lpq2SfgP5HujrcibsbLFNz+tVlpMtF1CzmRBOZxIOYGglKxPsK0zLgbWjME5P0jPx1svVYYtB37kYroCuX2gKFz9YPy0NefvvEySfjtExZlf9786Yvek4RUNjoS+DFHLqlky+IvtibmKprc4u+P65O72dGtFjrj6uvXB3a0sX+GOysjVfkCMydRSlCSkuIZzpto7SiIMk9KPZ6UkTLwqv+OyHRXrXNfYm6jHO1enJrPbi3zSR+7jkQp8NaFTzda6dqXANz2zCyw7jQa8QGhh2JWHV7azRpxp13EiF7trr4dT6m1/TSS2zu5/qY='},function(err,response){
	res.write(response.body);
	res.end();
  });
});

app.post('/',function(req,res){
	//console.log('Inside /POST');
	res.write('POST Called');
	res.end();
	 //log(req.headers['authorization'],true);
	 //log(JSON.stringify(req),true);
	 //console.log(JSON.stringify(req));
	
	 /*request.post(
	    {
			url : 'http://220.227.2.106:14489/Service/TPSLNotify.aspx?pgid=7',
			//headers : {
			//	authorization : req.headers['authorization']
			//},	
			json : req.body,			
			strictSSL: false
		}, 
	    function(err,response,b){
			 if(err || response.statusCode != 200)
			 {
			
				 res.json({
						 fulfillmentText: 'error while calling api: ' +err+ ' , code: ' + ((typeof(response)=='undefined' ||  response==null)?' Undefined': response.statusCode) ,
						 source: "testbean12"
					   });
				
			 }
		 else
			 {
			 //res.json({
			//			 fulfillmentText: response.body.fulfillmentText,
			//			 source: response.body.source
			//		   });
			console.log(response.body.fulfillmentText);
			console.log(response.body.source);
			}
		
	    });*/
	
});
app.get('/login',function(req,res){
	try{
		fs.readFileSync('./html/login.html');
	}
	catch(e)
	{
		console.log('Error occured' + e.stack);
	}
});

app.get('/testdialogflow',function(req,res){
res.send('Inside getheroku');
});

app.post('/testdialogflow',function (req, res) {
	console.log('Inside /testdialogflow');
	
	 //log(req.headers['authorization'],true);
	 //log(JSON.stringify(req),true);
	 //console.log(JSON.stringify(req));
	
	 request.post(
	    {
			url : 'https://115.254.126.74:1144/dialogflow',
			headers : {
				authorization : req.headers['authorization']
			},	
			json : req.body,			
			strictSSL: false
		}, 
	    function(err,response,b){
			 if(err || response.statusCode != 200)
			 {
			
				 res.json({
						 fulfillmentText: 'error while calling api: ' +err+ ' , code: ' + ((typeof(response)=='undefined' ||  response==null)?' Undefined': response.statusCode) ,
						 source: "testbean12"
					   });
				
			 }
		 else
			 {
			 res.json({
						 fulfillmentText: response.body.fulfillmentText,
						 source: response.body.source
					   });
			}
		
	    });
	
});

app.listen(process.env.PORT||9879);
console.log('Server running');

function log(txt, isError) {
    
	if ((typeof (isError) != 'undefined' && isError))
	{
		request.post(
			{
				url : 'https://115.254.126.74:1144/logging',				
				json : {message:txt, isError:isError},		
				strictSSL: false
			},
			function (error, response, body) {
			
			});
	}
}
	
	