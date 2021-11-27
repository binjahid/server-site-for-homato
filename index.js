//hometo
//kMPfltpb2KFFzxgR
const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;
const { application } = require("express");
require("dotenv").config();
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0mdbb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// console.log(uri);
async function run() {
  try {
    await client.connect();
    const database = client.db("homato");
    const servicesCollection = database.collection("services");
    const selectedServices = database.collection("selected-services");
    //Get all Service API
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const result = await cursor.toArray();
      console.log("i am connected wiht mongodb");
      res.json(result);
    });
    //get Single Service
    app.get("/single/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.findOne(query);
      res.json(result);
    });
    //post selected items
    app.post("/selected/services", async (req, res) => {
      const id = req.body;
      const { _id, name, img, price, title, description } = id;
      console.log("post api hitted", id);
      const doc = {
        _id,
        name,
        img,
        price,
        title,
        description,
      };
      const result = await selectedServices.insertOne(doc);
      // console.log(result);
      res.send(result);
    });
    //get all selected Services key
    app.get("/allSelectedServices", async (req, res) => {
      const cursor = selectedServices.find({});
      const services = await cursor.toArray();
      res.json(services);
      // console.log(services);
    });
    // delete a service
    app.delete("/deleteservice/:id", async (req, res) => {
      const { id } = req.params;
      console.log(id);
      const query = { _id: id };
      console.log(query);
      const result = await selectedServices.deleteOne(query);
      console.log(result);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("I am connected ");
});
app.get("/hello", (req, res) => {
  res.send("Hello How Are You?");
});
app.listen(port, () => {
  console.log("I am listening from port ", port);
});
