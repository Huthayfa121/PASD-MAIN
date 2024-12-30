const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const AdminModel = require('./models/Admin');
const models = require('./models/Data');
const {
    Status_Model,
    Usage_Model,
    Countries_Model,
    Cities_Model,
    Addresses_Model,
    bdr_Model,
    Buildings_Model,
    Architects_Model,
    Buildings_Architects_Model,
    Notaries_Model,
    Buildings_Notaries_Model,
    Owners_Model,
    Buildings_Owners_Model,
    Tenants_Model,
    Buildings_Tenants_Model,
    Buildings_Usage_Model,
    Buildings_Status_Model,
    Images_Model

 } = models;

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://alaaalqader:mmmmfCtCqZKoeriQ@cluster0.dndrd.mongodb.net/PASD?retryWrites=true&w=majority", {
    dbName: 'PASD'
})
.then(() => console.log('Connected to PASD database'))
.catch(err => console.error('MongoDB connection error:', err));


// Upload route using GridFSBucket
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const readableStream = new Readable();
    readableStream.push(req.file.buffer);
    readableStream.push(null); // End the stream

    const uploadStream = bucket.openUploadStream(req.file.originalname);
    readableStream.pipe(uploadStream)
        .on('error', (error) => {
            console.error('Upload error:', error);
            res.status(500).json({ error: 'Error uploading file' });
        })
        .on('finish', () => {
            console.log('File uploaded successfully:', uploadStream.id);
            res.status(200).json({ fileId: uploadStream.id, filename: req.file.originalname });


        });
});

// Retrieve file by filename
app.get('/image/:filename', async (req, res) => {
    try {
        const file = await bucket.find({ filename: req.params.filename }).toArray();
        if (!file || file.length === 0) {
            return res.status(404).json({ error: 'File not found' });
        }

        const downloadStream = bucket.openDownloadStreamByName(req.params.filename);
        downloadStream.pipe(res);
    } catch (error) {
        console.error('Error retrieving file:', error);
        res.status(500).json({ error: 'Error retrieving file' });
    }
});

// Retrieve file by ObjectId
app.get('/image/id/:id', async (req, res) => {
    try {
        const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(req.params.id));
        downloadStream.pipe(res);
    } catch (error) {
        console.error('Error retrieving file:', error);
        res.status(500).json({ error: 'Error retrieving file by ID' });
    }
});

// Retrieve file as Base64
app.get('/image/base64/:filename', async (req, res) => {
    try {
        const file = await bucket.find({ filename: req.params.filename }).toArray();
        if (!file || file.length === 0) {
            return res.status(404).json({ error: 'File not found' });
        }

        const downloadStream = bucket.openDownloadStreamByName(req.params.filename);
        let data = [];

        downloadStream.on('data', (chunk) => {
            data.push(chunk);
        });

        downloadStream.on('end', () => {
            const buffer = Buffer.concat(data);
            const base64 = buffer.toString('base64');
            const mimeType = file[0].contentType;

            res.send(`
                <html>
                    <body>
                        <h1>Image: ${file[0].filename}</h1>
                        <img src="data:${mimeType};base64,${base64}" alt="${file[0].filename}" />
                    </body>
                </html>
            `);
        });

        downloadStream.on('error', (err) => {
            console.error(err);
            res.status(500).json({ error: 'Error reading file' });
        });
    } catch (error) {
        console.error('Error retrieving file as Base64:', error);
        res.status(500).json({ error: error.message });
    }
});
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    AdminModel.findOne({ username: username })
        .then(admin => {
            if (admin) {
                if (admin.password === password) {
                res.json("Success")
            } else {
                res.json("username or password incorrect")
            }
            } else {
                res.json("username does not exist")
            }
    })
})

app.post('/addAdmin', async (req, res) => {
    try {
        const { first_name, last_name ,email, username, password} = req.body;

        // Check if an admin with the same username already exists
        const existingAdminusername = await AdminModel.findOne({ username });
        // Check if an admin with the same email already exists
        const existingAdminemail = await AdminModel.findOne({ email });

        // If either username or email already exists, send an error response
        if (existingAdminusername) {
            return res.status(409).json({ message: "Admin with this username already exists." });
        } else if (existingAdminemail) {
            return res.status(409).json({ message: "Admin with this email already exists." });
        }

        // Create and save the new admin (you might want to hash the password here)
        const newAdmin = await AdminModel.create({ first_name, last_name, email, username, password });

        // Return the success response
        res.status(201).json({ message: "Admin created successfully", admins: newAdmin });

    } catch (error) {
        // Catch any other errors that may occur during admin creation
        console.error("Error creating admin:", error);
        return res.status(500).json({ message: "Error creating admin", error });
    }
});




app.get('/admin/:username', (req, res) => {
    const { username } = req.params;
    AdminModel.findOne({ username })
        .then(admin => {
            if (admin) res.json(admin);
            else res.status(404).json({ message: "Admin not found" });
        })
        .catch(err => res.status(500).json(err));
});


app.put('/admin/:username', (req, res) => {
    const { username } = req.params;
    const updates = req.body;
    AdminModel.findOneAndUpdate({ username }, updates, { new: true })
        .then(updatedAdmin => res.json(updatedAdmin))
        .catch(err => res.status(500).json(err));
});

// fetch all admins
app.get('/getAdmins', async (req, res) => {
    try {
        const admins = await AdminModel.find(); // Fetch all admins
        res.status(200).json(admins); // Respond with admins in JSON format
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admins', error });
    }
});

// API Endpoint to Fetch Buildings
app.get('/buildings', async (req, res) => {
  try {
        const buildings = await Buildings_Model.find(); // Fetch all Building
        res.status(200).json(buildings); // Respond with admins in JSON format
  } catch (error) {
      console.error("Error fetching buildings:", error); // Debugging
      res.status(500).json({ error: "Internal Server Error" });
  }
});


// API Endpoint to Fetch Notaries
app.get('/notaries', async (req, res) => {
  try {
        const notaries = await Notaries_Model.find(); 
        res.status(200).json(notaries);
  } catch (error) {
      console.error("Error fetching notaries:", error); // Debugging
      res.status(500).json({ error: "Internal Server Error" });
  }
});


// API Endpoint to Fetch Owners
app.get('/owners', async (req, res) => {
  try {
        const owners = await Owners_Model.find();
        res.status(200).json(owners);
  } catch (error) {
      console.error("Error fetching owners:", error); // Debugging
      res.status(500).json({ error: "Internal Server Error" });
  }
});


// API Endpoint to Fetch Tenant
app.get('/tenants', async (req, res) => {
  try {
        const tenants = await Tenants_Model.find();
        res.status(200).json(tenants);
  } catch (error) {
      console.error("Error fetching tenants:", error); // Debugging
      res.status(500).json({ error: "Internal Server Error" });
  }
});

// API Endpoint to Fetch BDR
app.get('/bdr', async (req, res) => {
  try {
        const bdrs = await bdr_Model.find();
        res.status(200).json(bdrs);
  } catch (error) {
      console.error("Error fetching Building During the Reign:", error); // Debugging
      res.status(500).json({ error: "Internal Server Error" });
  }
});

// API Endpoint to Fetch Countries
app.get("/countries", async (req, res) => {
  try {
    const countries = await Countries_Model.find(); // Fetch only required fields
    res.status(200).json(countries);
  } catch (error) {
    res.status(500).json({ error: "Error fetching countries" });
  }
});

// Fetch Cities by Country ID
app.get("/cities", async (req, res) => {
  try {
    const { country_id } = req.query;
    if (country_id) {
      const cities = await Cities_Model.find({ country_id });
      res.status(200).json(cities);
    } else {
      res.status(400).json({ message: "country_id is required" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching cities" });
  }
});

app.delete('/notaries/:id', async (req, res) => {
    const id = req.params.id;
    console.log(id)
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    try {
        const deletedNotary = await Notaries_Model.findByIdAndDelete(id);
        if (!deletedNotary) {
            return res.status(404).json({ message: 'Notary not found' });
        }
        res.json({ message: 'Notary deleted successfully' });
    } catch (error) {
        console.error('Error deleting notary:', error);
        res.status(500).json({ message: 'Error deleting notary', error });
    }
});



app.put('/notaries/:id', async (req, res) => {
    const { id } = req.params;
    const update = req.body;
    console.log('ID:', req.params.id);
    console.log('Update Data:', req.body);
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    try {
        const updatedNotary = await Notaries_Model.findByIdAndUpdate(id, update, { new: true });
        if (!updatedNotary) {
            return res.status(404).json({ message: 'Notary not found' });
        }
        res.status(200).json(updatedNotary);
    } catch (error) {
        console.error('Error updating notary:', error);
        res.status(500).json({ error: 'Error updating notary', error });
    }
});


// Add city
app.post("/cities", async (req, res) => {
  const { city_name, country_id } = req.body;

    try {
    const newCity = await Cities_Model.create({country_id, city_name });
   
    res.status(201).json({ message: "City added successfully!", cities: newCity});
  } catch (error) {
    res.status(500).json({ error: "Error adding city" });
  }
});

// fetch all Architects
app.get("/Architects", async (req, res) => {
    try {
        const Architects = await Architects_Model.find(); 
        res.status(200).json(Architects);
    } catch (error) {
        console.error("Error fetching Architects:", error); // Debugging
        res.status(500).json({ error: "Internal Server Error" });
    }
});



// fetch all usage
app.get("/usage", async (req, res) => {
    try {
        const usage = await Usage_Model.find(); 
        res.status(200).json(usage);
    } catch (error) {
        console.error("Error fetching usage:", error); // Debugging
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// fetch all status
app.get("/status", async (req, res) => {
    try {
        const status = await Status_Model.find(); 
        res.status(200).json(status);
    } catch (error) {
        console.error("Error fetching status:", error); // Debugging
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Add building testt
app.post("/AddBuilding", async (req, res) => {
  const { building_name,area, ar_description,en_description,thsLink, frontImageLink, dateOfConstruction, documentationDate, numberOfFloors, bdr_id, address_id} = req.body;

    try {
    const newBuilding = await Buildings_Model.create({building_name,area, ar_description,en_description,thsLink, frontImageLink, dateOfConstruction, documentationDate, numberOfFloors, bdr_id, address_id});
   
    res.status(201).json({ message: "Building added successfully!", buildings: newBuilding});
  } catch (error) {
    res.status(500).json({ error: "Error adding building" });
  }
});

// fetch all Buildings
app.get("/get-buildings", async (req, res) => {
    try {
        const building = await Buildings_Model.find(); 
        res.status(200).json(building);
    } catch (error) {
        console.error("Error fetching building:", error); // Debugging
        res.status(500).json({ error: "Internal Server Error" });
    }
});




// Add Address
app.post("/AddAddress", async (req, res) => {
  const {city_id, street, coordinates} = req.body;

    try {
    const newAddress = await Addresses_Model.create({city_id, street, coordinates});
   
    res.status(201).json({ message: "Address added successfully!", addresses: newAddress});
  } catch (error) {
    res.status(500).json({ error: "Error adding Address" });
  }
});

// Add buildings_Usages
app.post("/add-building-usage", async (req, res) => {
  const { building_id, usage_id, type } = req.body;

  // Validate the data
  if (!building_id || !usage_id || !type) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    // Create and save the new usage document
    const newUsage = new Buildings_Usage_Model({ building_id,usage_id,type, });
    await newUsage.save(); // Save to MongoDB

    // Send success response
    res.status(200).json({
      message: "Building usage added successfully!",
      buildings_usages: newUsage,
    });
  } catch (error) {
    console.error("Error adding building usage:", error);
    res.status(500).json({ message: "An error occurred while adding usage." });
  }
});

//Add Buildings_status
app.post("/add-building-status", async (req, res) => {
  const { building_id, status_id } = req.body;

  try {
    // Create and save the new status document
    const newStatus = new Buildings_Status_Model({ building_id, status_id});
    await newStatus.save(); // Save to MongoDB

    // Send success response
    res.status(200).json({
      message: "Building usage added successfully!",
      buildings_status: newStatus,
    });
  } catch (error) {
    console.error("Error adding building status:", error);
    res.status(500).json({ message: "An error occurred while adding status." });
  }
});


//Add Buildings_Architects
app.post("/add-buildings-architects", async (req, res) => {
  const { building_id, architect_id } = req.body;

  try {
    // Create and save the new architects document
    const newArchitects = new Buildings_Architects_Model({ building_id, architect_id});
    await newArchitects.save(); // Save to MongoDB

    // Send success response
    res.status(200).json({message: "Buildings_Architects added successfully!",buildings_architects: newArchitects,});
  } catch (error) {
    console.error("Error adding Buildings_Architects:", error);
    res.status(500).json({ message: "An error occurred while adding Buildings_Architects." });
  }
});

//Add Architects
app.post("/add-architect", async (req, res) => {
  const { architect_name, architect_image, en_biography, ar_biography} = req.body;

  try {
    // Create and save the new notary document
    const newArchitects = new Architects_Model({architect_name, architect_image, en_biography, ar_biography});
    await newArchitects.save(); // Save to MongoDB

    // Send success response
    res.status(200).json({message: "Architects added successfully!", architects: newArchitects,});
  } catch (error) {
    console.error("Error adding Architects:", error);
    res.status(500).json({ message: "An error occurred while adding Architects." });
  }
});


//Add Notary
app.post("/add-notary", async (req, res) => {
  const { notary_name} = req.body;

  try {
    // Create and save the new notary document
    const newNotary = new Notaries_Model({notary_name});
    await newNotary.save(); // Save to MongoDB

    // Send success response
    res.status(200).json({message: "notary added successfully!", notaries: newNotary,});
  } catch (error) {
    console.error("Error adding notary:", error);
    res.status(500).json({ message: "An error occurred while adding notary." });
  }
});


//Add Buildings_Notaries
app.post("/add-buildings-notaries", async (req, res) => {
  const { building_id, notary_id, building_name } = req.body;

  try {
    // Create and save the new notary document
    const newNotary = new Buildings_Notaries_Model({ building_id, notary_id, building_name});
    await newNotary.save(); // Save to MongoDB

    // Send success response
    res.status(200).json({message: "Buildings_Notaries added successfully!", buildings_notaries: newNotary,});
  } catch (error) {
    console.error("Error adding Buildings_Notaries:", error);
    res.status(500).json({ message: "An error occurred while adding Buildings_Notaries." });
  }
});

//Add Buildings_Owners
app.post("/add-buildings-owners", async (req, res) => {
  const { building_id, owner_id } = req.body;

  try {
    // Create and save the new Owners document
    const newOwners = new Buildings_Owners_Model({ building_id, owner_id});
    await newOwners.save(); // Save to MongoDB

    // Send success response
    res.status(200).json({message: "Buildings_Owners added successfully!", buildings_owners: newOwners,});
  } catch (error) {
    console.error("Error adding Buildings_Owners:", error);
    res.status(500).json({ message: "An error occurred while adding Buildings_Owners." });
  }
});

//Add Owners
app.post("/add-owner", async (req, res) => {
  const { owner_name} = req.body;

  try {
    // Create and save the new notary document
    const newOwner = new Owners_Model({owner_name});
    await newOwner.save(); // Save to MongoDB

    // Send success response
    res.status(200).json({message: "owner added successfully!", owners: newOwner,});
  } catch (error) {
    console.error("Error adding owner:", error);
    res.status(500).json({ message: "An error occurred while adding owner." });
  }
});


//Add Buildings_Tenant
app.post("/add-buildings-tenants", async (req, res) => {
  const { building_id, tenant_id } = req.body;

  try {
    // Create and save the new Tenant document
    const newTenant = new Buildings_Tenants_Model({ building_id, tenant_id});
    await newTenant.save(); // Save to MongoDB

    // Send success response
    res.status(200).json({message: "buildings_tenants added successfully!", buildings_tenants: newTenant,});
  } catch (error) {
    console.error("Error adding buildings_tenants:", error);
    res.status(500).json({ message: "An error occurred while adding buildings_tenants." });
  }
});

//Add Tenant
app.post("/add-tenant", async (req, res) => {
  const { tenant_name} = req.body;

  try {
    // Create and save the new notary document
    const newTenant = new Tenants_Model({tenant_name});
    await newTenant.save(); // Save to MongoDB

    // Send success response
    res.status(200).json({message: "Tenant added successfully!", tenants: newTenant,});
  } catch (error) {
    console.error("Error adding Tenant:", error);
    res.status(500).json({ message: "An error occurred while adding Tenant." });
  }
});


//Add Images
app.post("/add-images", async (req, res) => {
  const { building_id, description, image } = req.body;

  try {
    // Create and save the new images document
    const newImages = new Images_Model({ building_id, description, image});
    await newImages.save(); // Save to MongoDB

    // Send success response
    res.status(200).json({message: "images added successfully!", images: newImages,});
  } catch (error) {
    console.error("Error adding images:", error);
    res.status(500).json({ message: "An error occurred while adding images." });
  }
});


app.get('/notaries/:id/buildings', async (req, res) => {
  const { id } = req.params;
  try {
    console.log("Fetching buildings for notary:", id);
    const notaryBuildings = await Buildings_Notaries_Model.find({ notary_id: id })
      .populate('building_id');

    console.log("Notary buildings found:", notaryBuildings);

    const buildingsWithDetails = notaryBuildings.map(buildings => {
      if (!buildings.building_id) {
        console.warn("Missing building details for:", buildings);
        return null; // Handle missing data
      }
      return {
        building_id: buildings.building_id._id,
        building_name: buildings.building_id.building_name,
      };
    }).filter(Boolean); // Remove null entries

    res.status(200).json(buildingsWithDetails);
  } catch (error) {
    console.error("Error fetching buildings:", error);
    res.status(500).json({ error: 'Failed to fetch buildings' });
  }
});


app.get('/architects/:id/buildings', async (req, res) => {
  const { id } = req.params;
  try {
    console.log("Fetching buildings for architect:", id);
    const architectBuildings = await Buildings_Architects_Model.find({ architect_id: id })
      .populate('building_id');

    console.log("Architect buildings found:", architectBuildings);

    const buildingsWithDetails = architectBuildings.map(buildings => {
      if (!buildings.building_id) {
        console.warn("Missing building details for:", buildings);
        return null; // Handle missing data
      }
      return {
        building_id: buildings.building_id._id,
        building_name: buildings.building_id.building_name,
      };
    }).filter(Boolean); // Remove null entries

    res.status(200).json(buildingsWithDetails);
  } catch (error) {
    console.error("Error fetching buildings:", error);
    res.status(500).json({ error: 'Failed to fetch buildings' });
  }
});



app.get('/owners/:id/buildings', async (req, res) => {
  const { id } = req.params;
  try {
    console.log("Fetching buildings for owner:", id);
    const ownerBuildings = await Buildings_Owners_Model.find({ owner_id: id })
      .populate('building_id');

    console.log("Owner buildings found:", ownerBuildings);

    const buildingsWithDetails = ownerBuildings.map(building => {
      if (!building.building_id) {
        console.warn("Missing building details for:", building);
        return null; // Handle missing data
      }
      return {
        building_id: building.building_id._id,
        building_name: building.building_id.building_name,
      };
    }).filter(Boolean); // Remove null entries

    res.status(200).json(buildingsWithDetails);
  } catch (error) {
    console.error("Error fetching buildings:", error);
    res.status(500).json({ error: 'Failed to fetch buildings' });
  }
});




// Server setup
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
