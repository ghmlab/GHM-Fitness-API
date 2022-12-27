const moment = require('moment');
const uuid = require('uuid');
const db = require('monk')(process.env.DB_CONNECT);
const shopData = db.get("ghmfitshop");

/* ------------ FETCH SHOP DATA ---------------*/

const fetchShopData = () => {

};

/* ------------ POST SHOP DATA ---------------*/

const postShopData = (req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    const images = req.body.images;
    const price = req.body.price;
    const specialPrice = req.body.specialPrice;

    shopData.insert({
        date: moment().unix(),
        id: uuid.v4(),
        name: name,
        description: description,
        price: price,
        specialPrice: specialPrice,
        images: images
    })

};