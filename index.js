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

    const allAdminsCollection = client.db("Alliance").collection("Admins");
    const allDoctorsCollection = client.db("Alliance").collection("Doctors");
    const allPatientsCollection = client.db("Alliance").collection("Patients");
    const allStaffsCollection = client.db("Alliance").collection("Staffs");

    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    app.get("/", (req, res) => {
      res.send("Welcome to the Alliance API!");
    });

    app.post("/admins", async (req, res) => {
      try {
        const adminData = req.body;
        const result = await client
          .db("Alliance")
          .collection("Admins")
          .insertOne(adminData);
        res.status(201).send(result);
      } catch (error) {
        console.error("Failed to register admin:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.get("/admins", async (req, res) => {
      const result = await allAdminsCollection.find().toArray();
      res.send(result);
    });

    app.post("/doctors", async (req, res) => {
      try {
        const doctorData = req.body;
        const result = await client
          .db("Alliance")
          .collection("Doctors")
          .insertOne(doctorData);
        res.status(201).send(result);
      } catch (error) {
        console.error("Failed to register doctor:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.get("/doctors", async (req, res) => {
      const result = await allDoctorsCollection.find().toArray();
      res.send(result);
    });

    app.post("/patients", async (req, res) => {
      try {
        const patientData = req.body;
        const result = await client
          .db("Alliance")
          .collection("Patients")
          .insertOne(patientData);
        res.status(201).send(result);
      } catch (error) {
        console.error("Failed to register patient:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.get("/patients", async (req, res) => {
      const result = await allPatientsCollection.find().toArray();
      res.send(result);
    });

    app.post("/staffs", async (req, res) => {
      try {
        const patientData = req.body;
        const result = await client
          .db("Alliance")
          .collection("Staffs")
          .insertOne(patientData);
        res.status(201).send(result);
      } catch (error) {
        console.error("Failed to register patient:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.get("/staffs", async (req, res) => {
      const result = await allStaffsCollection.find().toArray();
      res.send(result);
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
