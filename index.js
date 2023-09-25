const express = require('express');
const app = express();
const port = 8000;

// use express router
app.get('/', require('./routes'));
app.listen(port, function(err){
    if(err){
        console.log(`Error in the running the server : ${err}`);
    }
    console.log(`Server in running on port : ${port}`);
});