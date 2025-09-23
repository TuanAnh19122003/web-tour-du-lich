import React, { useEffect, useState } from 'react';
import { Table, Card, Spin, message, Tag } from 'antd';
import axios from 'axios';
import { formatCurrency, formatDate } from '../../utils/helpers';

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                const storedUser = localStorage.getItem('user');
                if (!storedUser) {
                    message.error('Người dùng không tồn tại');
                    return;
                }
                const user = JSON.parse(storedUser);
                const userId = user.id;

                const res = await axios.get(`${API_URL}/bookings/user/${userId}`);
                setBookings(res.data.data || []);
            } catch (error) {
                console.error(error);
                message.error('Lấy lịch sử đặt tour thất bại');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [API_URL]);

    const columns = [
        {
            title: 'Mã tour',
            dataIndex: ['tour', 'code'],
            key: 'code',
        },
        {
            title: 'Tên tour',
            dataIndex: ['tour', 'name'],
            key: 'name',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price) => formatCurrency(Number(price)),
        },
        {
            title: 'Thành tiền',
            key: 'total',
            render: (_, record) => formatCurrency(Number(record.price * record.quantity)),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <h2>Lịch sử đặt tour của bạn</h2>
            {loading ? (
                <Spin spinning={true} tip="Đang tải...">
                    <div style={{ minHeight: 200 }}></div>
                </Spin>
            ) : bookings.length === 0 ? (
                <p>Bạn chưa đặt tour nào.</p>
            ) : (
                bookings.map((booking) => (
                    <Card
                        key={booking.id}
                        title={
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Booking #{booking.id}</span>
                                <Tag color={
                                    booking.status === 'pending' ? 'orange' :
                                    booking.status === 'paid' ? 'blue' :
                                    booking.status === 'completed' ? 'green' :
                                    'red'
                                }>
                                    {booking.status.toUpperCase()}
                                </Tag>
                            </div>
                        }
                        style={{ marginBottom: 24 }}
                    >
                        <p><strong>Ngày đặt:</strong> {formatDate(booking.booking_date)}</p>
                        <p><strong>Phương thức thanh toán:</strong> {booking.paymentMethod.toUpperCase()}</p>
                        <p><strong>Ghi chú:</strong> {booking.note || '-'}</p>

                        <Table
                            columns={columns}
                            dataSource={booking.items.map(item => ({
                                key: item.id,
                                tour: item.tour,
                                quantity: item.quantity,
                                price: item.price,
                            }))}
                            pagination={false}
                            style={{ marginTop: 16 }}
                        />

                        <h3 style={{ textAlign: 'right', marginTop: 10 }}>
                            Tổng: {formatCurrency(Number(booking.total_price))}
                        </h3>
                    </Card>
                ))
            )}
        </div>
    );
};

export default BookingHistory;
