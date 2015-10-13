(function(){
	"use strict";
	
	var config = require("./config");
	
	module.exports.setupHeaders = function(req,res,next){
		res.header('Access-Control-Allow-Origin', config.allowOrigin);
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
		
		next();	
	};
})();