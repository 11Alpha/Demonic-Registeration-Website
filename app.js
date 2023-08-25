require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
    const firstname = req.body.fname;
    const lastname = req.body.lname;
    const email = req.body.email;

    console.log(firstname,lastname,email);

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstname,
                    LNAME: lastname,
                }

            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/e287d167f1"

    const options = {
        method: "POST",
        auth: "aniket:" + process.env.MAILCHIMP_API_KEY
    };


    const requests = https.request(url, options,  function(response){
        if(response.statusCode==200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        };

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    });

    requests.write(jsonData);
    requests.end();
});

app.post("/failure",function(req,res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000,function(){
    console.log("Port started on 3000 !");
});
