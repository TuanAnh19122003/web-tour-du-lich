import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Result, Button, Spin, message } from "antd";
import axios from "axios";

const BookingSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const bookingId = searchParams.get("bookingId");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!bookingId) {
            setLoading(false);
            return;
        }

        const confirmBooking = async () => {
            try {
                // Gọi API để update booking status sau khi PayPal redirect
                await axios.put(`http://localhost:5000/api/bookings/${bookingId}`, {
                    status: "paid",
                });
                message.success("Thanh toán thành công!");
            } catch (err) {
                message.error(err.response?.data?.message || "Xác nhận thất bại!");
            } finally {
                setLoading(false);
            }
        };

        confirmBooking();
    }, [bookingId]);

    if (loading) return <Spin style={{ marginTop: "50px" }} />;

    return (
        <Result
            status="success"
            title="Thanh toán thành công!"
            subTitle={`Cảm ơn bạn đã đặt tour. Mã booking: ${bookingId}`}
            extra={[
                <Button type="primary" key="home" onClick={() => navigate("/")}>
                    Về trang chủ
                </Button>,
                <Button key="mybookings" onClick={() => navigate("/booking-history")}>
                    Xem booking của tôi
                </Button>,
            ]}
        />
    );
};

export default BookingSuccess;
