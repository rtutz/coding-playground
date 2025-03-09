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
This endpoint gets the materials (only id, type and title) associated
with a specific module
*/
app.get('/modules/:moduleId/materials', async (req, res) => {
    try {
        const moduleId = req.params.moduleId;
        const module = await Module.findById(moduleId).select('materials.title materials.type materials._id');
        
        if (!module) {
            return res.status(404).json({ message: 'Module not found' });
        }
        
        res.json(module.materials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/*
This endpoint gets the material with id <materialId> associated with <moduleId>
*/
app.get('/modules/:moduleId/materials/:materialId', async (req, res) => {
    try {
        const { moduleId, materialId } = req.params;
        
        const module = await Module.findById(moduleId);
        
        if (!module) {
            return res.status(404).json({ message: 'Module not found' });
        }
        
        const material = module.materials.id(materialId);
        
        if (!material) {
            return res.status(404).json({ message: 'Material not found' });
        }
        
        res.json(material);
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
        const { title, subtitle } = req.body;
        const newModule = new Module({
            title,
            subtitle,
            materials: []
        });
        const savedModule = await newModule.save();
        res.status(201).json(savedModule);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post('/modules/:moduleId/materials', async (req, res) => {
    try {
        const { moduleId } = req.params;
        const { type, title } = req.body;

        // Find the module by ID
        const module = await Module.findById(moduleId);

        if (!module) {
            return res.status(404).json({ message: 'Module not found' });
        }

        // Create a new material
        const newMaterial = {
            type,
            title,
            // Add any other fields you need for a material
            content: ' ',
            ...(type === 'quiz' && { 
                options: [
                    {
                        content: '',
                        is_right: false
                    },
                    {
                        content: '',
                        is_right: false
                    },
                    {
                        content: '',
                        is_right: false
                    },
                    {
                        content: '',
                        is_right: false
                    }
                ]
            })
        };
        
        // Add the new material to the module's materials array
        module.materials.push(newMaterial);

        // Save the updated module
        const updatedModule = await module.save();

        res.status(201).json(updatedModule);
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
// app.post('/modules/:id/materials', async (req, res) => {
//     try {
//         const module = await Module.findById(req.params.id);
//         if (!module) {
//             return res.status(404).json({ message: 'Module not found' });
//         }
//         module.materials.push(req.body);
//         const updatedModule = await module.save();
//         res.status(201).json(updatedModule);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });

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

app.delete('/module/:id', async (req, res) => {
    try {
        const moduleId = req.params.id;
        const result = await Module.findByIdAndDelete(moduleId);
        
        if (!result) {
            return res.status(404).json({ message: "Module not found" });
        }
        
        res.status(200).json({ message: "Module successfully deleted", deletedModule: result });
    } catch (error) {
        res.status(500).json({ message: "Error deleting module", error: error.message });
    }
});

app.delete('/modules/:moduleId/materials/:materialId', async (req, res) => {
    try {
        const { moduleId, materialId } = req.params;
        const module = await Module.findById(moduleId);

        if (!module) {
            return res.status(404).json({ message: "Module not found" });
        }

        // Remove material from module's materials array
        module.materials = module.materials.filter(
            (mat) => mat._id.toString() !== materialId
        );

        await module.save();

        res.status(200).json({ message: "Material successfully deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting material", error: error.message });
    }
});


// Update the contents of materialId
app.put('/modules/:moduleId/materials/:materialId', async (req, res) => {
    try {
        const module = await Module.findById(req.params.moduleId);
        if (!module) {
            return res.status(404).json({ message: 'Module not found' });
        }

        const lesson = module.materials.id(req.params.materialId);
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        lesson.content = req.body.content;
        const updatedModule = await module.save();

        res.status(200).json(lesson);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


app.put('/modules/:moduleId/materials/quiz/:materialId', async (req, res) => {
    try {
        const module = await Module.findById(req.params.moduleId);
        if (!module) return res.status(404).json({ message: 'Module not found' });

        const lesson = module.materials.id(req.params.materialId);
        if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

        // Update all relevant quiz fields
        lesson.content = req.body.content;
        lesson.options = req.body.options; // Add this line
        const updatedModule = await module.save();

        res.status(200).json(lesson);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
