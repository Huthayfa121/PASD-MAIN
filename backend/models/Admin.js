const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Ensure email is unique
    username: { type: String, required: true, unique: true }, // Fixed typo in "unique"
    password: { type: String, required: true }
});



const AdminModel = mongoose.model("admins", AdminSchema);
module.exports = AdminModel;
