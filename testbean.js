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

app.post('/alexa',requestVerifier,function(req,res){

	var reqTimestamp = new Date(req.body.request.timestamp).getTime();
	var curTimestamp = new Date().getTime();
	var delayinSeconds = (curTimestamp-reqTimestamp)/1000;
	
	
	if(delayinSeconds<150)
	{
		request.post(
	    {
			url : 'https://115.254.126.74:1144/alexa',	
			json : req.body,			
			strictSSL: false
		}, 
	    function(err,response,b){
			 if(err || response.statusCode != 200)
			 {
				 res.json({
						"version": "1.0",
						"response": {
						  "shouldEndSession": false,
						  "outputSpeech": {
							"type": "SSML",
							"ssml": "<speak>" + "Error occurred" + "</speak>"
						  }
						}
					   });
				
			 }
		 else
			 {
			 res.json({
						"version": "1.0",
						"response": {
						  "shouldEndSession": false,
						  "outputSpeech": {
							"type": "SSML",
							"ssml": "<speak>" + response.body.message + "</speak>"
						  }
						}
					   });
			}
		
	    });
	}
	else{
		return res.status(500).json({
		  status: "error"
		});
	}

});

app.post('/alexa/token',function(req,res){
	try
	{
		/*log('Request type: ' + typeof(req.body),true);
		log('String: '+JSON.stringify(req.body),true);
		log('Object: '+req.body,true);*/

			request.post(
			{
				url : 'https://115.254.126.74:1144/oauth/alexatoken',	
				//headers: req.headers,
				json : req.body,			
				strictSSL: false
			}, 
			function(err,response,b){
				if(err || response.statusCode != 200)
					{
						res.json({
									"access_token" : null,
									"token_type" : null,
									"expires_in" : null,
									"refresh_token" : null
							   });
					}
				 else
					{
					 res.json({
								"access_token" : response.body.access_token,
								"token_type" : "bearer",
								"expires_in" : response.body.expires_in,
								"refresh_token" : response.body.refresh_token
							   });
					}	
			});
	}
	catch(e)
	{
	log(e.stack,true);
	}
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
	
	