document.addEventListener('DOMContentLoaded', function () {

    const form = document.getElementById('add-card-form');
    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Ngăn chặn việc gửi biểu mẫu mặc định

        // Chuyển giá trị nhập vào của trường 'cardHolderName' thành chữ hoa
        const cardHolderNameInput = form.querySelector('[name="cardHolderName"]');
        cardHolderNameInput.value = cardHolderNameInput.value.toUpperCase();

        const formData = new FormData(form);
        const cardData = {
            cardNumber: formData.get('cardNumber'),
            bankName: formData.get('bankName'),
            cardHolderName: formData.get('cardHolderName'),
            customerName: formData.get('customerName'),
            amount: formData.get('amount'),
            dueDate: formData.get('dueDate')
        };


        fetch('/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cardData),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Thêm thẻ thành công')
                    // Chuyển hướng về trang chủ hoặc hiển thị một thông báo thành công
                    window.location.href = '/';
                } else {
                    // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng
                    alert('Lỗi: thẻ của bạn đã tồn tại');
                }
            })
            .catch(error => {
                console.error('Lỗi:', error);
            });
    });

});
