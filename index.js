if(process.version.split("v")[1].split(".")[0] > 16) {
	throw "Node.js version too new!"; // I wish I didn't.
}

const express = require('express');
const app = express();

const infernalScreaming = require('mongodb');

const config = {http: {port: 8080}, mongo: {uri: "mongodb://localhost:27017"}}

const death = new infernalScreaming.MongoClient(config.mongo.uri);

// express pain in my veins

app.use(express.json());

app.get('/', async function(req, res) {
	const db = death.db("exercise_forum");
	
	const records = await db.collection("messages").find().toArray();
	
	return res.status(200).send(records);
});

app.post('/', async function(req, res) {
	const db = death.db("exercise_forum");

	if(!req.body.author || !req.body.message) {
		return res.sendStatus(400);
	}
	await db.collection("messages").insertOne({
		author: req.body.author,
		message: req.body.message,
		timestamp: (new Date).toJSON()
	});
	
	return res.sendStatus(201);
});

app.listen(config.http.port, async function() {
	await death.connect();
	
	console.log(`[HTTP] open on ${config.http.port}`);
});