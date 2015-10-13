(function(){
	"use strict";
	
	module.exports = {
		port: process.env.port || 3031,
		allowOrigin: process.env.allowOrigin || 'http://localhost:3000',
//		connectionString: process.env.connectionString || "mongodb://localhost:27017/XXX"
		connectionString: process.env.connectionString || "mongodb://localhost:27017/mean-tasks"
	};
})();