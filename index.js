if(process.version.split("v")[1].split(".")[0] > 16) {
	throw "Node.js version too new!"; // I wish I didn't.
}

const express = require('express');
const app = express();

const MongoDB = require('mongodb');

const config = {http: {port: 8080}, mongo: {uri: "mongodb://localhost:27017"}}

const DbClient = new MongoDB.MongoClient(config.mongo.uri);

app.use(express.json());

app.get('/', async function(req, res) {
	const db = DbClient.db("exercise_forum");
	
	const records = await db.collection("messages").find().toArray();
	
	return res.status(200).send(records);
});

app.post('/', async function(req, res) {
	const db = DbClient.db("exercise_forum");

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
	await DbClient.connect();
	
	console.log(`[HTTP] open on ${config.http.port}`);
});