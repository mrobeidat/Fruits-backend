const express = require('express');

const cors = require('cors');

const axios = require('axios');

require('dotenv').config();

const server = express();

server.use(cors());

server.use(express.json());

PORT = process.env.PORT || 3090;

const mongoose = require('mongoose');


let fruitModel;

main().catch(err => console.log(err));


async function main() {
    await mongoose.connect(process.env.MONGO_URL);

    const fruitSchema = new mongoose.Schema({
        name: String,
        image: String,
        price: String,
        email: String

    });

    fruitModel = mongoose.model('fruit', fruitSchema);


}


server.get('/getFruit', getFruitHandler);
server.post('/addToFav', addFruitHandler);
server.get('/getFav', getFavHandler);
server.delete('/delete/:id', deleteHandler);
server.put('/update/:id', updateHandler);


function getFruitHandler(req, res) {

    axios.get('https://fruit-api-301.herokuapp.com/getFruit')
        .then(results => {
            res.send(results.data.fruits)
        })

}

async function addFruitHandler(req, res) {

    let { name, image, price, email } = req.body;

    await fruitModel.create({
        name: name,
        image: image,
        price: price,
        email: email
    })

    fruitModel.find({ email: email }, (err, result) => {

        if (err) {
            console.log(err)
        }
        else {
            res.send(result)
        }
    })
}

function getFavHandler(req, res) {

    let email = req.query.email;
    fruitModel.find({ email: email }, (err, result) => {

        if (err) {
            console.log(err)
        }
        else {
            res.send(result)
        }
    })

}

function deleteHandler(req, res) {

    const id = req.params.id;
    const email = req.query.email;

    fruitModel.deleteOne({ _id: id }, (err, result) => {

        fruitModel.find({ email: email }, (err, result) => {

            if (err) {
                console.log(err)
            }
            else {
                res.send(result)
            }
        })

    })

}

function updateHandler(req, res) {

    const { name, image, price, email } = req.body;

    fruitModel.findByIdAndUpdate(id, { name, image, price }, (err, result) => {


        fruitModel.find({ email: email }, (err, result) => {

            if (err) {
                console.log(err)
            }
            else {
                res.send(result)
            }
        })



    })


}




server.listen(PORT, () => {

    console.log(`I'm listining on port :${PORT}`);
});