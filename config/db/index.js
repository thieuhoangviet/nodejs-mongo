const mongoose = require('mongoose');

async function connect(){
    await mongoose.connect('mongodb://127.0.0.1/Card'
    , {useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log('Kết nối DB thành công'))
    .catch(() => console.log('Kết nối thất bại'))
}

module.exports = { connect }