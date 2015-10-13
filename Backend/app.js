"use strict";

var config = require("./setup/config");
var app = require("express")();

//Logging
var fs = require("fs");
var morgan = require("morgan"); 

app.use(require("body-parser").json());

//Logging
var accessLogStream = fs.createWriteStream(__dirname+"/access.log",{flags:"a"});
app.use(morgan("combined", {stream: accessLogStream}));

require("./routes")(app);

app.listen(config.port);
console.log("Listening on " + config.port + "...")