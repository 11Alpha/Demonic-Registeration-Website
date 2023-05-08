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

	const url = "https://us14.api.mailchimp.com/3.0/lists/c42fa0313b"

	const options = {
		method:"POST",
		auth:"aniket:6ad00056ba0dd39841d8717dbb579c60-us14"
	}

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

	// requests.write(jsonData);
	requests.end();
});

app.post("/failure",function(req,res){
	res.redirect("/");
});

app.listen(3000,function(){
	console.log("Port started on 3000 !");
});


//API:- 6ad00056ba0dd39841d8717dbb579c60-us14
// Audience Id:- c42fa0313b.