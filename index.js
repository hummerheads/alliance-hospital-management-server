const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// Global collection variables
let allAdminsCollection;
let allDoctorsCollection;
let allPatientsCollection;
let allStaffsCollection;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection URI
const uri = `mongodb+srv://Amitumikeyahay:Amb0KzBetxDVVYBT@cluster0.ebsbi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create MongoDB client with options
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  maxPoolSize: 10,
  connectTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});

async function initializeCollections() {
  try {
    allAdminsCollection = client.db("Alliance").collection("Admins");
    allDoctorsCollection = client.db("Alliance").collection("Doctors");
    allPatientsCollection = client.db("Alliance").collection("Patients");
    allStaffsCollection = client.db("Alliance").collection("Staffs");
    console.log("Collections initialized successfully");
  } catch (error) {
    console.error("Error initializing collections:", error);
    throw error;
  }
}

// Connection handling with retries
async function connectWithRetry(maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await client.connect();
      console.log("Successfully connected to MongoDB!");
      return true;
    } catch (err) {
      console.error(`Connection attempt ${attempt} failed:`, err);
      if (attempt === maxRetries) {
        console.error("Max retries reached. Exiting...");
        process.exit(1);
      }
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }
}

async function run() {
  try {
    await connectWithRetry();
    await initializeCollections();

    app.get("/", (req, res) => {
      res.send("Welcome to the Alliance API!");
    });
  // GET all admins
  app.get("/admins", async (req, res) => {
    try {
      const admins = await allAdminsCollection.find({}).toArray();
      res.json(admins);
    } catch (error) {
      res.status(500).json({ message: "Error fetching admins", error: error.message });
    }
  });

  // GET all doctors
  app.get("/doctors", async (req, res) => {
    try {
      const doctors = await allDoctorsCollection.find({}).toArray();
      res.json(doctors);
    } catch (error) {
      res.status(500).json({ message: "Error fetching doctors", error: error.message });
    }
  });

  // GET all patients
  app.get("/patients", async (req, res) => {
    try {
      const patients = await allPatientsCollection.find({}).toArray();
      res.json(patients);
    } catch (error) {
      res.status(500).json({ message: "Error fetching patients", error: error.message });
    }
  });

  // GET all staff
  app.get("/staffs", async (req, res) => {
    try {
      const staffs = await allStaffsCollection.find({}).toArray();
      res.json(staffs);
    } catch (error) {
      res.status(500).json({ message: "Error fetching staff", error: error.message });
    }
  });
    // Admin Registration Route
    app.post("/admins", async (req, res) => {
      try {
        const adminData = req.body;
        const query = { email: adminData.email };
        const existingAdmin = await allAdminsCollection.findOne(query);

        if (existingAdmin) {
          return res.status(400).json({ message: "Admin already exists" });
        }

        const result = await allAdminsCollection.insertOne({
          ...adminData,
          role: "admin",
          createdAt: new Date()
        });
        res.status(201).json(result);
      } catch (error) {
        res.status(500).json({ message: "Error creating admin", error: error.message });
      }
    });

    // Doctor Registration Route
    app.post("/doctors", async (req, res) => {
      try {
        const doctorData = req.body;
        const query = { email: doctorData.email };
        const existingDoctor = await allDoctorsCollection.findOne(query);

        if (existingDoctor) {
          return res.status(400).json({ message: "Doctor already exists" });
        }

        const result = await allDoctorsCollection.insertOne({
          ...doctorData,
          role: "doctor",
          createdAt: new Date(),
          status: "pending"
        });
        res.status(201).json(result);
      } catch (error) {
        res.status(500).json({ message: "Error creating doctor", error: error.message });
      }
    });

    // Patient Registration Route
    app.post("/patients", async (req, res) => {
      try {
        const patientData = req.body;
        const query = { email: patientData.email };
        const existingPatient = await allPatientsCollection.findOne(query);

        if (existingPatient) {
          return res.status(400).json({ message: "Patient already exists" });
        }

        const result = await allPatientsCollection.insertOne({
          ...patientData,
          role: "patient",
          createdAt: new Date(),
          medicalHistory: [],
          appointments: []
        });
        res.status(201).json(result);
      } catch (error) {
        res.status(500).json({ message: "Error creating patient", error: error.message });
      }
    });

    // Staff Registration Route
    app.post("/staffs", async (req, res) => {
      try {
        const staffData = req.body;
        const query = { email: staffData.email };
        const existingStaff = await allStaffsCollection.findOne(query);

        if (existingStaff) {
          return res.status(400).json({ message: "Staff already exists" });
        }

        const result = await allStaffsCollection.insertOne({
          ...staffData,
          role: "staff",
          createdAt: new Date(),
          department: staffData.department || "General"
        });
        res.status(201).json(result);
      } catch (error) {
        res.status(500).json({ message: "Error creating staff", error: error.message });
      }
    });

    // Profile routes
    app.get("/:role/profile/:email", async (req, res) => {
      try {
        const { role, email } = req.params;
        const collections = {
          admins: allAdminsCollection,
          doctors: allDoctorsCollection,
          patients: allPatientsCollection,
          staffs: allStaffsCollection
        };

        const collection = collections[role];
        if (!collection) {
          return res.status(400).json({ message: "Invalid role" });
        }

        const profile = await collection.findOne({ email });
        if (!profile) {
          return res.status(404).json({ message: "Profile not found" });
        }

        res.json(profile);
      } catch (error) {
        res.status(500).json({ message: "Error fetching profile", error: error.message });
      }
    });

    // Update profile routes
    app.patch("/:role/profile/:email", async (req, res) => {
      try {
        const { role, email } = req.params;
        const updates = req.body;
        
        // Security: Remove sensitive fields
        delete updates._id;
        delete updates.email;
        delete updates.role;
        delete updates.password;

        const collections = {
          admins: allAdminsCollection,
          doctors: allDoctorsCollection,
          patients: allPatientsCollection,
          staffs: allStaffsCollection
        };

        const collection = collections[role];
        if (!collection) {
          return res.status(400).json({ message: "Invalid role" });
        }

        const result = await collection.updateOne(
          { email },
          { $set: updates }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "Profile not found" });
        }

        res.json({ success: true, message: "Profile updated successfully" });
      } catch (error) {
        res.status(500).json({ message: "Error updating profile", error: error.message });
      }
    });

  } catch (error) {
    console.error("Fatal error during startup:", error);
    process.exit(1);
  }
}

// Graceful shutdown handling
process.on('SIGINT', async () => {
  try {
    await client.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error during graceful shutdown:', err);
    process.exit(1);
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
