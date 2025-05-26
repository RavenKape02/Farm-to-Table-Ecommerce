const Order = require('../models/Order');

const getSalesReport = async (req, res) => {
  try {
    const orders = await Order.find({ status: 'completed' })
      .populate('items.product', 'productName productPrice');

    const salesReport = orders.map(order => ({
      orderId: order._id,
      date: order.createdAt,
      items: order.items.map(item => ({
        productName: item.product.productName,
        quantity: item.quantity,
        price: item.product.productPrice,
        total: item.quantity * item.product.productPrice
      })),
      totalAmount: order.totalAmount
    }));

    res.json(salesReport);
  } catch (error) {
    console.error('Get sales report error:', error);
    res.status(500).json({ message: 'Error fetching sales report' });
  }
};

module.exports = {
  getSalesReport
}; 