const mongoose = require('mongoose');
// page schema

const pageSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug :{
        type: String,
        
    },
    content: {
        type: String,
        required: true
    },
    sorting: {
        type: Number,
    
    },
    
    
})

const page = module.exports = mongoose.model('Page', pageSchema);