var app = require('./app');
const mongoose = require('mongoose');
const config = require("./config/appConfig.js");

app.set('port', process.env.PORT || 8000);
var server = app.listen(config.PORT, () => console.log("App listening on port : " + server.address().port));

console.log("Try to connect to Mongo at", config.DB);
mongoose.connect(config.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then( () =>{
    console.log("Connected to ", config.DB);
    
}).catch( err => console.error("Failed to connect to mongo at " +  config.DB, err));

