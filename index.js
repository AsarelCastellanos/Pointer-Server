var express = require("express");
var mongodb = require("mongodb");
var bodyparser = require("body-parser");
var cors = require("cors");
var jsonparser = bodyparser.json({
	limit:'200mb'
});
var app = express();

var client = mongodb.MongoClient;
var music;
var religious;
var users;
var url = process.env.MONGODB_URI || 'mongodb://localhost:27017/miligate';
client.connect(url, function(err,db){
	if(err){
		console.log("error connecting");
		process.exit(1);
		throw err;
	}else{
		console.log("connected to our database")
		music = db.collection("music");
		religious = db.collection("religious");
		users = db.collection("users")
	}
})

app.use(cors());
app.use(bodyparser.urlencoded({
	extended:true
}))


app.get("/",function(req,res){
	res.sendStatus(200);
})

app.get("/pullMusic",function(req,res){
	music.find().toArray(function(err,docs){
		if(err){
			throw err;
			res.sendStatus(500);
		}else{
			var result = docs.map(function(data){
				return data;
			})
			res.json(result);
		}
	})
})


app.get("/pullReligious",function(req,res){
	religious.find().toArray(function(err,docs){
		if(err){
			throw err;
			res.sendStatus(500);
		}else{
			var result = docs.map(function(data){
				return data;
			})
			res.json(result);
		}
	})
})


app.post("/saveEvent",function(req,res){
	console.log(req.body);
	var name = req.body.name;
	var event = req.body.event;
	users.findOneAndUpdate({
		"name": name
	},
	{
		$push: {"savedEvents":event }
	}, function(err,docs){
		if(err){
			res.sendFile(err);
		}else{
			res.sendStatus(200);
		}
	})
})

app.get('/returnSavedEvents',function(req,res){
	console.log(req);

	users.find({
		"name":"John Doe"
	},function(err,docs){
		if(err){
			res.send(err);
		}else{
			res.send(docs);
		}

	})
})

var port = process.env.PORT || 8080;
app.listen(port, function() {
	console.log('Listening on port ' +port);
});