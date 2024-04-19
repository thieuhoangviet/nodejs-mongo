const express = require('express');
const router = express.Router();
const CreditCard = require('../models/CreditCard'); // The Mongoose model you need to create
const moment = require('moment');
const {
  json
} = require('body-parser');
const dueDate = new Date();
const formattedDueDate = moment(dueDate).format('DD-MM-YYYY');
// Route to render the main page
router.get('/', async (req, res) => {

  try {
    const creditCards = await CreditCard.find();
    const formattedCards = creditCards.map(card => {
      const dueDate = moment(card.dueDate);
      const now = moment();
      const daysDiff = dueDate.diff(now, 'days', true);

      let color;
      if (daysDiff < 0) {
        color = 'black';
      } else if (daysDiff < 5) {
        color = 'red';
      } else if (daysDiff <= 15) {
        color = 'yellow';
      } else {
        color = '#99FF00';
      }

      return {
        ...card._doc,
        dueDate: dueDate.format('DD-MM-YYYY'),
        color // Thêm trường color vào đối tượng để sử dụng trong template
      };
    });

    res.render('index', {
      creditCards: formattedCards
    });
  } catch (error) {
    res.status(500).send(error);
  }
});
router.post('/', async (req, res) => {
  const cardNumber = req.body.cardNumber;
  const bankName = req.body.bankName;

  // Lấy tất cả các thẻ có cùng số thẻ
  const cardsWithSameNumber = await CreditCard.find({
    cardNumber: cardNumber
  });
  // Kiểm tra trong các thẻ trùng số, có thẻ nào trùng ngân hàng không
  const existingCard = cardsWithSameNumber.some(card => card.bankName === bankName);

  if (existingCard) {
    // Nếu tìm thấy thẻ trùng số và ngân hàng, trả về lỗi
    return res.status(400).json({
      error: 'Thẻ với số thẻ và ngân hàng tương ứng đã tồn tại'
    });
  }

  // Nếu không tìm thấy thẻ trùng, tạo thẻ mới
  const newCard = new CreditCard({
    cardNumber: req.body.cardNumber,
    cardHolderName: req.body.cardHolderName,
    bankName: req.body.bankName,
    customerName: req.body.customerName,
    dueDate: new Date(req.body.dueDate),
  });

  await newCard.save(); // Lưu thẻ mới vào cơ sở dữ liệu
  res.json({
    success: true,
    message: 'Thêm thẻ thành công'
  });

});

const banks = [
  "Ngân hàng Ngoại thương Việt Nam (Vietcombank)",
  "Ngân hàng Công thương Việt Nam (VietinBank)",
  "Ngân hàng Đầu tư và Phát triển Việt Nam (BIDV)",
  "Ngân hàng Quân đội (MBBank)",
  "Ngân hàng Thương mại Cổ phần Á Châu (ACB)",
  "Ngân hàng Sài Gòn Thương Tín (Sacombank)",
  "Ngân hàng Tiên Phong (TPBank)",
  "Ngân hàng Kỹ thương Việt Nam (Techcombank)",
  "Ngân hàng TMCP Xuất Nhập khẩu (Eximbank)",
  "Ngân hàng TMCP Đông Á (DongA Bank)",
  "Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank)",
  "Ngân hàng TMCP Đại Dương (OceanBank)",
  "Ngân hàng TMCP Bắc Á (BacABank)",
  "Ngân hàng TMCP Đông Nam Á (SeABank)",
  "Ngân hàng TMCP Kiên Long (KienLongBank)",
  "Ngân hàng TMCP An Bình (ABBank)",
  "Ngân hàng TMCP Việt Nam Thương Tín (Vietbank)",
  "Ngân hàng TMCP Sài Gòn Công Thương (Saigonbank)",
  "Ngân hàng TMCP Bưu điện Liên Việt (LienVietPostBank)",
  "Ngân hàng TMCP Ngoại thương Việt Nam (Vietnam Export Import Bank - Eximbank)",
  "Ngân hàng TMCP Phát triển TP.HCM (HDBank)",
  "Ngân hàng TMCP Đại Chúng Việt Nam (PVcomBank)",
  "Ngân hàng TMCP Quốc Dân (NCB)",
  "Ngân hàng TMCP Việt Nam Thái Bình Dương (Vietnam Asia Commercial Joint Stock Bank - VAB)",
  "Ngân hàng TMCP Đại Tín (Dai Tin Bank)",
  "Ngân hàng TMCP Xăng dầu Petrolimex (PGBank)",
  "Ngân hàng TMCP Bản Việt (VietCapitalBank)",
  "Ngân hàng TMCP Phương Đông (OCB)",
  "Ngân hàng TMCP Nam Á (Nam A Bank)",
  "Ngân hàng TMCP Sài Gòn-Hà Nội (SHB)",
  "Ngân hàng TMCP Việt Nam Thái Sơn (Vietnam ThaiSon Bank)",
  "Ngân hàng TMCP Đại Dương (Ocean Commercial Joint Stock Bank)",
  "Ngân hàng TMCP Hàng Hải (Maritime Bank)",
  "Ngân hàng TMCP Công Thương Việt Nam (Vietnam Maritime Commercial Joint Stock Bank - Maritime Bank)",
  "Ngân hàng TMCP Phương Tây (Western Bank - WB)",
  "Ngân hàng TMCP Đại Việt (Dai Viet Bank)",
  "Ngân hàng TMCP Sài Gòn Công nghiệp (Saigon Industry Bank - SGBank)",
  "Ngân hàng TMCP Đông Dương (Indovina Bank)",
  "Ngân hàng TMCP Việt Nam Thái Bình Dương (Vietnam Asia Commercial Bank - VACB)",
  "Ngân hàng Thương mại Cổ phần Bưu điện Liên Việt (LienVietPostBank)",
  "Ngân hàng TMCP Hàng Hải Việt Nam (Vietnam Maritime Commercial Joint Stock Bank - Maritime Bank)",
  "Ngân hàng TMCP Đại Dương (OceanBank)",
  "Ngân hàng TMCP Bắc Á (BacABank)",
  "Ngân hàng TMCP Đông Nam Á (SeABank)",
  "Ngân hàng TMCP Kiên Long (KienLongBank)",
  "Ngân hàng TMCP An Bình (ABBank)",
  "Ngân hàng TMCP Việt Nam Thương Tín (Vietbank)",
  "Ngân hàng TMCP Sài Gòn Công Thương (Saigonbank)",
  "Ngân hàng TMCP Công thương (Vietnam Export Import Bank - Eximbank)",
  " VPBank Finance Company Limited (FE Credit)",
  "Ngân hàng Thương mại Cổ phần Quốc tế (VIB)",
  "Ngân hàng Công thương Á Âu (CIMB)",
  "Home Credit Group(Home)"
];


router.get('/add', (req, res) => {
  // Giả định này
  res.render('addCard', {
    banks,
    dueDate: formattedDueDate
  });
});


// Sự kiện gia hạn thẻ
router.patch('/:id/renew', async (req, res) => {
  try {
    const card = await CreditCard.findById(req.params.id);
    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Thẻ không tồn tại'
      });
    }

    let originalDueDate = moment(card.dueDate);
    let originalDay = originalDueDate.date(); // Lấy ngày của tháng hiện tại
    let originalMonth = originalDueDate.month(); // Lấy tháng hiện tại (0-11)

    // Thêm 1 tháng vào ngày thanh toán
    let newDueDate = originalDueDate.clone().add(1, 'months');

    // Kiểm tra số ngày của tháng mới để điều chỉnh ngày hết hạn
    let daysInNewMonth = newDueDate.daysInMonth();
    if (originalDay > daysInNewMonth) {
      // Nếu ngày ban đầu lớn hơn số ngày trong tháng mới, đặt ngày hết hạn là ngày cuối cùng của tháng mới
      newDueDate.date(daysInNewMonth);
    } else {
      // Giữ ngày hết hạn như ban đầu nếu có đủ ngày trong tháng mới
      newDueDate.date(originalDay);
    }

    // Điều chỉnh ngày hết hạn cho các trường hợp đặc biệt
    if (originalDay === 31) {
      if (newDueDate.month() === 1) { // Tháng 2 sau tháng 1
        // Điều chỉnh cho tháng 2, năm nhuận hoặc không nhuận
        if (moment(`${originalDueDate.year()}-02-01`).isLeapYear()) {
          newDueDate.date(29);
        } else {
          newDueDate.date(28);
        }
      } else if (newDueDate.month() === 2 && daysInNewMonth === 31) { // Tháng 3 sau tháng 2
        // Nếu tháng hiện tại là tháng 2 và tháng tiếp theo là tháng 3 có 31 ngày
        newDueDate.date(31);
      }
    } else if (originalDay === 30 && newDueDate.month() === 2 && daysInNewMonth === 31) { // Tháng 3 sau tháng 2
      // Điều chỉnh ngày hết hạn quay trở lại 30 nếu tháng tiếp theo là tháng có 30 ngày
      newDueDate.date(30);
    } else if (originalDay >= 30 && [1, 3, 5, 7, 8, 10, 12].includes(newDueDate.month()) && daysInNewMonth === 31) { // Tháng có 30 ngày, tháng sau là 31 ngày
      // Đặt lại ngày 30 hoặc 31 tùy thuộc vào ngày gốc nếu tháng trước là tháng 31 ngày
      newDueDate.date(originalDay);
    }

    card.dueDate = newDueDate.toDate();
    await card.save();

    res.json({
      success: true,
      message: 'Gia hạn thành công',
      newDueDate: newDueDate.format('YYYY-MM-DD')
    });
  } catch (error) {
    console.error('Error during renewal:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi gia hạn: ' + error.message
    });
  }
});

// Trong file creaditCards.js hoặc một file tương tự
router.get('/edit/:id', async (req, res) => {
  try {
    const card = await CreditCard.findById(req.params.id);
    if (!card) {
      res.status(404).send('Thẻ không tìm thấy');
    } else {
      res.render('editCard', {
        card,
        banks
      }); // Gửi dữ liệu thẻ tới trang sửa thông tin
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/edit/:id', async (req, res) => {
  try {
    const updatedCard = await CreditCard.findByIdAndUpdate(req.params.id, {
      cardNumber: req.body.cardNumber,
      cardHolderName: req.body.cardHolderName.toUpperCase(), // Chuyển tên chủ thẻ thành chữ hoa
      bankName: req.body.bankName,
      customerName: req.body.customerName,
      dueDate: req.body.dueDate
    }, {
      new: true
    }); // Option `new: true` để trả về đối tượng đã được cập nhật

    if (!updatedCard) {
      res.status(404).send('Không tìm thấy thẻ để cập nhật');
    } else {
      res.redirect('/'); // Chuyển hướng về trang danh sách thẻ sau khi cập nhật
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// xóa thẻ
router.post('/delete/:id', async (req, res) => {
  try {
      await CreditCard.findByIdAndDelete(req.params.id);
      res.redirect('/'); // Chuyển hướng người dùng trở lại trang chính sau khi xóa
  } catch (error) {
      res.status(500).send("Lỗi khi xóa thẻ: " + error);
  }
});

module.exports = router;