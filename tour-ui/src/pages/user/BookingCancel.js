import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Result, Button } from "antd";

const BookingCancel = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const bookingId = searchParams.get("bookingId");

    return (
        <Result
            status="warning"
            title="Thanh toán bị hủy"
            subTitle={`Booking của bạn (${bookingId}) chưa được thanh toán. Bạn có thể thử lại.`}
            extra={[
                <Button type="primary" key="retry" onClick={() => navigate(`/tour/${bookingId}`)}>
                    Thử lại
                </Button>,
                <Button key="home" onClick={() => navigate("/")}>
                    Về trang chủ
                </Button>,
            ]}
        />
    );
};

export default BookingCancel;
