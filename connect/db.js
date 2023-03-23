const mongoose = require('mongoose');

const connectDb = async (url) => {
    mongoose.connect(url)
    .then((res) => {
        console.log("db is connected");
    })
    .catch((err) => {
        console.log(err)

    })
}

module.exports = connectDb;