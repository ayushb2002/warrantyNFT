const mongoose = require('mongoose')
var Schema = mongoose.Schema;

const expiry = new Schema({
    extension: {type: Number, required: true, dropDups: true},
    payment: {type: Boolean, required: true, default: false},
    tokenId:  {type: Number, required: true, dropDups: true, unique: true},
    companyId: {type: Number, required: true, dropDups: true}
});

module.exports = mongoose.model('Expiry', expiry);