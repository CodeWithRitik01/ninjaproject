const express = require('express');
const app = express();
const port = 8000;

// use express router
app.get('/', require('./routes'));

// set up view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.listen(port, function(err){
    if(err){
        console.log(`Error in the running the server : ${err}`);
    }
    console.log(`Server in running on port : ${port}`);
});