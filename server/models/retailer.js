const mongoose = require('mongoose')
var Schema = mongoose.Schema;

const retailer = new Schema({
    name: {type: String, required: true, dropDups: true},
    wallet:  {type: String, required: true, dropDups: true},
    company: {type: Number, required: true, dropDups: true}
});

module.exports = mongoose.model('Retailer', retailer);