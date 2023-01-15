const mongoose = require('mongoose')
var Schema = mongoose.Schema;

const company = new Schema({
    companyId: {type: Number, unique: true, required: true, dropDups: true},
    name: {type: String, unique: true, required: true, dropDups: true},
    wallet:  {type: String, unique: true, required: true, dropDups: true}
});

module.exports = mongoose.model('Company', company);