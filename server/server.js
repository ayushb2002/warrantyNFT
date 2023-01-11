require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');
const Company = require('./models/company');
const Product = require('./models/product');
const app = express();

main().catch(err => console.log(err));

app.post('/register', (req, res) => {
    var type = req.body.type;

    if(type=="product")
    {
        var name = req.body.name;
        var model = req.body.model;
        var manufacturer = req.body.manufacturer;
        var description = req.body.description;

        const prod = new Product({
            name: name,
            manufacturer: manufacturer,
            model: model,
            details:description
        })

        prod.save(function(err){
            if (err) 
            {
                console.log(err);
                return false;
            }
        });
        
    }
    else if(type == "company")
    {
        var name = req.body.name;
        var wallet = req.body.wallet;

        const orgz = new Company({
            name: name,
            wallet: wallet
        });

        orgz.save(function(err){
            if (err) 
            {
                console.log(err);
                return false;
            }
        });
    }

    return true;
})

async function main() 
{
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected Successfully!");
    app.listen(5000);
    console.log('Server listening on port 5000');
}