const mongoose = require('mongoose');

/* 
A NoSQL schema for a module. This contains nested information.
A module has the following contents:
    1. title - A required string
    2. Subtitle
    3. An array of materials of the following types:
        - lesson: Requires title and content. Must not have 
                    testCases nor options.
        - problem: Requires title and content. May or may not have
                    testCases. Must not have options.
        - quiz: Must have a title and content (serves as the question). 
                    Options are mandatory as well and must be of length 
                    at least 2.
*/
const moduleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: String,
    materials: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
            type: { type: String, enum: ['lesson', 'problem', 'quiz'], required: true },
            title: {
                type: String,
                required: function() { return this.type !== 'quiz'; }
            },
            content: {
                type: String,
                required: true
            },
            testCases: [{
                input: String,
                expectedOutput: String
            }],
            options: [{
                content: String,
                isRight: Boolean
            }]
        }
    ]
});

// Custom validation for the materials array
moduleSchema.path('materials').validate(function(materials) {
    return materials.every(material => {
        switch (material.type) {
            case 'lesson':
                return material.title && material.content && (!material.testCases || material.testCases.length === 0) && (!material.options || material.options.length === 0);
            case 'problem':
                return material.title && material.content && (!material.options || material.options.length === 0);
            case 'quiz':
                return material.title && material.content && Array.isArray(material.options) && material.options.length >= 2;
            default:
                return false;
        }
    });
}, 'Invalid material structure');



const Module = mongoose.model('Module', moduleSchema);

module.exports = Module;
