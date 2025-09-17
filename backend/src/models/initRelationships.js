// models/initRelationships.js
module.exports = (db) => {
    const { Role, User, Tour, Discount, Booking, BookingDetail, Payment, Review } = db;

    // ========== Role ↔ User ==========
    User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
    Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });

    // ========== User ↔ Booking ==========
    Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });

    // ========== Discount ↔ Booking ==========
    Booking.belongsTo(Discount, { foreignKey: 'discountId', as: 'discount' });
    Discount.hasMany(Booking, { foreignKey: 'discountId', as: 'bookings' });

    // ========== Booking ↔ BookingDetail ==========
    BookingDetail.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });
    Booking.hasMany(BookingDetail, { foreignKey: 'bookingId', as: 'details' });

    // ========== Tour ↔ BookingDetail ==========
    BookingDetail.belongsTo(Tour, { foreignKey: 'tourId', as: 'tour' });
    Tour.hasMany(BookingDetail, { foreignKey: 'tourId', as: 'bookingDetails' });

    // ========== Booking ↔ Payment ==========
    Payment.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });
    Booking.hasMany(Payment, { foreignKey: 'bookingId', as: 'payments' });

    // ========== User ↔ Review ==========
    Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });

    // ========== Tour ↔ Review ==========
    Review.belongsTo(Tour, { foreignKey: 'tourId', as: 'tour' });
    Tour.hasMany(Review, { foreignKey: 'tourId', as: 'reviews' });
};
