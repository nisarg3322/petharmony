const express = require('express');
const app = express();

app.get('/',(req,res) => {
    res.send("welcome to petharmony")
})

app.listen(3000 , () => {
    console.log("Listening on 3000")
})