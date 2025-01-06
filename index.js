const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");


const app = express();
const port = process.env.PORT || 5000;


// Middleware
app.use(cors({ origin: "*" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const uri = `mongodb+srv://Amitumikeyahay:Amb0KzBetxDVVYBT@cluster0.ebsbi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
    try {
      // await client.connect();
      console.log("Connected to MongoDB!");
  
      const allUserCollection = client.db("Alliance").collection("userCollection");
      
  

  
      // await client.db("admin").command({ ping: 1 });
      console.log(
        "Pinged your deployment. You successfully connected to MongoDB!"
      );
  
      app.get("/", (req, res) => {
        res.send("Welcome to the Alliance API!");
      });
  
     
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }
  }
  
  run().catch(console.dir);
  
  app.get("/", (req, res) => {
    res.send("Alliance Server is Running");
  });
  app.listen(port, () => {
    console.log(`Alliance Server is listening on ${port}`);
  });