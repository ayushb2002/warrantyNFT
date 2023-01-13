require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');
const Company = require('./models/company');
const Product = require('./models/product');
const cors = require('cors');
const { handler } = require("daisyui");
const app = express();
app.use(cors());
app.use(express.json());

main().catch(err => console.log(err));

app.post('/register', (req, res) => {
    var type = req.body.type;
    if(type=="product")
    {
        const query = Company.findOne({wallet: req.body.manufacturer.toString()});
        query.exec((err, company) => {
            if(err) 
            {
                console.log(err);
                res.send(false);
                return;
            }
            else
            {
            const prod = new Product({
                name: req.body.name.toString(),
                manufacturer: company,
                model: req.body.model.toString(),
                details: req.body.description.toString(),
                imgUrl: req.body.imgUrl.toString()
            })

            prod.save(function(err, result){
                if (err) 
                {
                    console.log(err);
                    res.send(false);
                    return;
                }
            });
            }
        })

        res.send(true);
        return;
    }
    else if(type == "company")
    {
        const orgz = new Company({
            name: req.body.name.toString(),
            wallet: req.body.wallet.toString()
        });

        orgz.save(function(err, result){
            if (err) 
            {
                console.log(err);
                res.send(false);
                return;
            }
        });

        res.send(true);
        return;
    }
    else
    {
        res.send(false);
        return;
    }
})

app.get('/companies', async (req, res) => {
    const filter = {}
    const all = await Company.find(filter);
    res.send(all);
})

app.param('company', async (req, res, next, company) => {
    const orgz = await Company.findOne({'name': company});
    const products = await Product.find({'manufacturer': orgz}).populate('manufacturer')
    res.send(products);
    next();
})

app.get('/product/:company', (req, res, next) => {
    res.end();
});

async function main() 
{
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected Successfully!");
    app.listen(5000);
    console.log('Server listening on port 5000');
}