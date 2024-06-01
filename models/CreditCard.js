const mongoose = require('mongoose');
const { Schema } = mongoose;

const banks = [
  " Vietcombank ",
  " VietinBank ",
  " BIDV ",
  " MBBank ",
  " ACB ",
  " Sacombank ",
  " TPBank ",
  " Techcombank ",
  " Eximbank ",
  " DongA Bank ",
  " VPBank ",
  " OceanBank ",
  " BacABank ",
  " SeABank ",
  " KienLongBank ",
  " ABBank ",
  " Vietbank ",
  " Saigonbank ",
  " LienVietPostBank ",
  " HDBank ",
  " PVcomBank ",
  " NCB ",
  " VAB ",
  " Dai Tin Bank ",
  " PGBank ",
  " VietCapitalBank ",
  " OCB ",
  " Nam A Bank ",
  " SHB ",
  " MSB ",
  " Western Bank - WB ",
  " Dai Viet Bank ",
  " Saigon Industry Bank - SGBank ",
  " Indovina Bank ",
  " FE Credit",
  " VIB ",
  " CIMB ",
  " Home Credit "
];
const creditCardSchema = new Schema({
  cardNumber: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /\d{16}/.test(v);
      },
      message: props => `${props.value} không phải là số thẻ hợp lệ!`
    },
    unique: false
  },
  cardHolderName: {
    type: String,
    required: true,
    uppercase: true // Chuyển tên thành chữ hoa
  },
  amount: { // thêm trường mới
    type: Number,
    required: true
  },
  bankName: {
    type: String,
    required: true,
    enum: banks,
  },
  customerName: {
    type: String,
  },
  dueDate: {
    type: Date,
    required: true
  },
});



const CreditCard = mongoose.model('CreditCard', creditCardSchema);
module.exports = CreditCard;
