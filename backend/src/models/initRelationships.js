module.exports = (db) => {
    const { Role, User, Tour, Discount, Booking, BookingItem, Review } = db;

    // ========== Role ↔ User ==========
    User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
    Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });

    // ========== User ↔ Booking ==========
    Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });

    // ========== Discount ↔ Tour ==========
    Tour.belongsTo(Discount, { foreignKey: 'discountId', as: 'discount' });
    Discount.hasMany(Tour, { foreignKey: 'discountId', as: 'tours' });

    // ========== Booking ↔ BookingItem ==========
    Booking.hasMany(BookingItem, { foreignKey: 'bookingId', as: 'items' });
    BookingItem.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });

    // ========== Tour ↔ BookingItem ==========
    Tour.hasMany(BookingItem, { foreignKey: 'tourId', as: 'bookingItems' });
    BookingItem.belongsTo(Tour, { foreignKey: 'tourId', as: 'tour' });

    // ========== User ↔ Review ==========
    User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
    Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

    // ========== Tour ↔ Review ==========
    Tour.hasMany(Review, { foreignKey: 'tourId', as: 'reviews' });
    Review.belongsTo(Tour, { foreignKey: 'tourId', as: 'tour' });
};
