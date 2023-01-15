const mongoose = require('mongoose')
var Schema = mongoose.Schema;

const buyer = new Schema({
    name: {type: String, required: true},
    wallet: {type: String, unique: true, required: true, dropDups: true},
    email: {type: String, unique: true, required: true, dropDups: true},
    redeemedTokenId: {type: []},
    ownedTokenId: {type: []}
});

module.exports = mongoose.model('Buyer', buyer);