require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const Module = require('./models/module');
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Define routes
app.get('/', (req, res) => {
    res.send('Hello, MongoDB!');
});

/* 
This endpoint gets all the modules so it can be displayed in general.
For each module, it should return the title, subtitle, and for each
material, it should return the title and type.
*/
app.get('/modules', async (req, res) => {
    try {
        const modules = await Module.find().select('title subtitle materials.title materials.type materials._id');
        res.json(modules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/* 
This endpoint gets the module with the id defined in the param.
It returns all the info and the materials needed for that module.
*/
app.get('/modules/:id', async (req, res) => {
    try {
        const module = await Module.findById(req.params.id);
        if (!module) {
            return res.status(404).json({ message: 'Module not found' });
        }
        res.json(module);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/* 
This endpoint creates a new module and saves it to the database.
*/
app.post('/modules', async (req, res) => {
    try {
        const newModule = new Module(req.body);
        const savedModule = await newModule.save();
        res.status(201).json(savedModule);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/* 
==================== NON - REQUIRED ENDPOINTS FOR MVP ====================
*/

/* 
This endpoint creates a new material for a specific module defined.
*/
app.post('/modules/:id/materials', async (req, res) => {
    try {
        const module = await Module.findById(req.params.id);
        if (!module) {
            return res.status(404).json({ message: 'Module not found' });
        }
        module.materials.push(req.body);
        const updatedModule = await module.save();
        res.status(201).json(updatedModule);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/modules', async (req, res) => {
    try {
        const result = await Module.deleteMany({});
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "No modules found to delete" });
        }
        res.status(200).json({ message: `Successfully deleted ${result.deletedCount} modules` });
    } catch (error) {
        res.status(500).json({ message: "Error deleting modules", error: error.message });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
