require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');
const Company = require('./models/company');
const Product = require('./models/product');
const Buyer = require('./models/buyer');
const Retailer = require('./models/retailer');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

main().catch(err => console.log(err));

app.post('/register', async (req, res) => {
    var type = req.body.type;
    if (type == "product") {
        const query = Company.findOne({
            wallet: req.body.manufacturer.toString()
        });
        query.exec((err, company) => {
            if (err) {
                console.log(err);
                res.send(false);
                return;
            } else {
                const prod = new Product({
                    itemId: req.body.itemId,
                    name: req.body.name.toString(),
                    manufacturer: company,
                    model: req.body.model.toString(),
                    expiry: req.body.expiry,
                    imgUrl: req.body.imgUrl.toString()
                })

                prod.save(function (err, result) {
                    if (err) {
                        console.log(err);
                        res.send(false);
                        return;
                    }
                });
            }
        })

        res.send(true);
        return;
    } else if (type == "company") {
        const orgz = new Company({
            companyId: req.body.companyId,
            name: req.body.name.toString(),
            wallet: req.body.wallet.toString()
        });

        orgz.save(function (err, result) {
            if (err) {
                console.log(err);
                res.send(false);
                return;
            }
        });

        res.send(true);
        return;
    } else if (type == "buyer") {
        try {
            const buyer = new Buyer;
            buyer.name = req.body.name.toString();
            buyer.email = req.body.email.toString();
            buyer.wallet = req.body.wallet.toString();
            buyer.save((err, result) => {
                if (err) {
                    console.log(err);
                    res.send(false);
                    return;
                }
            });

            res.send(true);
            return;
        } catch (e) {
            console.log(e);
            res.send(false);
            return;
        }
    } else if (type == "retailer") {

        const verify = await Company.findOne({
            'wallet': req.body.companyAddress.toString()
        });
        if (!verify || verify == null) {
            res.send(false);
            return;
        }

        if (verify.companyId != req.body.companyId) {
            res.send(false);
            return;
        }

        const preExist = await Retailer.find({
            'wallet': req.body.wallet.toString()
        });
        
        for(var i=0; i<preExist.length; i++)
        {
            if(preExist[i].company == req.body.companyId)
            {
                res.send(false);
                return;
            }
        }

        const retailer = new Retailer({
            name: req.body.name.toString(),
            wallet: req.body.wallet.toString(),
            company: req.body.companyId
        });

        retailer.save((err, result) => {
            if (err) {
                console.log(err);
                res.send(false);
                return;
            }
        });
        res.send(true);
        return;
    } else {
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
    const orgz = await Company.findOne({
        'name': company
    });
    const products = await Product.find({
        'manufacturer': orgz
    }).populate('manufacturer')
    res.send(products);
    next();
})

app.get('/product/:company', (req, res, next) => {
    res.end();
});

app.param('buyerWallet', async (req, res, next, wallet) => {
    const buyer = await Buyer.findOne({
        'wallet': wallet
    });
    res.send(buyer);
    next();
});

app.get('/users/:buyerWallet', (req, res, next) => {
    res.end();
});

app.post('/bookItem', async (req, res) => {
    const buyer = await Buyer.findOne({
        'email': req.body.email.toString()
    });
    if (!buyer) {
        res.send(false);
        return;
    }
    buyer.ownedTokenId.push(req.body.tokenId);
    buyer.save();
    res.send(true);
    return;
});

app.param('companyWallet', async (req, res, next, companyWallet) => {
    const company = await Company.findOne({
        'wallet': companyWallet.toString()
    });
    if (!company || company == null) {
        res.send(false);
        return;
    }
    res.send(true);
    next();
})

app.get('/isCompany/:companyWallet', (req, res, next) => {
    res.end();
})

app.param('retailerWallet', async (req, res, next, retailerWallet) => {
    const retailer = await Retailer.find({
        'wallet': retailerWallet.toString()
    });
    if (!retailer || retailer == null || retailer == [] || retailer.length <=0) {
        res.send(false);
        return;
    }
    res.send(true);
    next();
})

app.get('/isRetailer/:retailerWallet', (req, res, next) => {
    res.end();
})

app.param('itemId', async (req, res, next, itemId) => {
    const product = Product.findOne({'itemId': itemId});
    if(!product)
    {
        res.send(false);
        return;
    }
    res.send(product);
    next();
})

app.get('/item/:itemId', (req, res, next) => {
    res.end();
})

async function main() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected Successfully!");
    app.listen(5000);
    console.log('Server listening on port 5000');
}