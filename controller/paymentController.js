const Razorpay = require('razorpay');
const instance = new Razorpay({
    key_id: 'rzp_test_0XQKxkeISKufmh',
    key_secret: '8Yg1preucbIJrYpPkjaU8MsW',
});

const checkOut = async (req, res, next) => {
    const { amount } = req.body;
    const option = {
        amount: amount * 100,
        currency: 'INR',
    };
    const order = await instance.orders.create(option);
    res.json({
        success: true,
        order,
    });
};

const paymentVerification = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id } = req.body;
    res.json({
        razorpay_order_id,
        razorpay_payment_id,
    });
};

module.exports = {
    checkOut,
    paymentVerification,
};
