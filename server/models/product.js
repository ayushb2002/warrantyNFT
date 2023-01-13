const mongoose = require('mongoose')
var Schema = mongoose.Schema;

const product = new Schema({
    name: {type: String},
    manufacturer: [{type: Schema.Types.ObjectId, ref: 'Company'}],
    model: {type: String},
    details: {type: String},
    imgUrl: {type: String}
});

module.exports = mongoose.model('Product', product);