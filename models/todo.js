const mongoose = require('mongoose');
const todoSchema = new mongoose.Schema({
    task : String,
    priority: String
})

module.exports = mongoose.model('Todo',todoSchema);