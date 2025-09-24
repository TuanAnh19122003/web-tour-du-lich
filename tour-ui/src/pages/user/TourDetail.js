import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Typography,
    Spin,
    Row,
    Col,
    Button,
    Rate,
    List,
    Avatar,
    Modal,
    InputNumber,
    message,
} from "antd";
import { formatCurrency } from "../../utils/helpers";

const { Title, Paragraph } = Typography;

const TourDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [tour, setTour] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingReviews, setLoadingReviews] = useState(true);

    // Modal state
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [confirmLoading, setConfirmLoading] = useState(false);

    // user
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        axios
            .get(`http://localhost:5000/api/tours/${slug}`)
            .then((res) => {
                setTour(res.data.data);
                return axios.get(
                    `http://localhost:5000/api/reviews/tour/${res.data.data.id}`
                );
            })
            .then((res) => setReviews(res.data.data))
            .catch((err) => console.error(err))
            .finally(() => {
                setLoading(false);
                setLoadingReviews(false);
            });
    }, [slug]);

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin tip="Đang tải..." />
            </div>
        );
    }
    if (!tour) return <p>Không tìm thấy tour.</p>;

    // 👉 Tính giá vé có giảm giá
    const ticketPrice = tour.discount
        ? tour.price * (1 - tour.discount.percentage / 100)
        : tour.price;
    const totalPrice = ticketPrice * quantity;

    const handleBooking = async () => {
        if (!user) {
            message.error("Bạn cần đăng nhập để đặt tour");
            return navigate("/login");
        }
        setIsModalVisible(true);
    };

    const handleConfirmBooking = async () => {
        try {
            setConfirmLoading(true);
            const bookingData = {
                userId: user.id,
                items: [
                    {
                        tourId: tour.id,
                        quantity,
                        price: ticketPrice,
                    },
                ],
                total_price: totalPrice,
                paymentMethod: "paypal", // Chỉ còn PayPal
            };

            const res = await axios.post(
                `http://localhost:5000/api/bookings`,
                bookingData
            );

            if (res.data.approveUrl) {
                window.location.href = res.data.approveUrl;
            } else {
                message.success("Đặt tour thành công!");
                navigate("/booking-history");
            }
        } catch (err) {
            console.error(err);
            message.error("Đặt tour thất bại");
        } finally {
            setConfirmLoading(false);
            setIsModalVisible(false);
        }
    };

    return (
        <div style={{ padding: "40px" }}>
            <Row gutter={24}>
                <Col xs={24} md={12}>
                    <img
                        src={`http://localhost:5000/${tour.image}`}
                        alt={tour.name}
                        style={{ width: "100%", borderRadius: "8px" }}
                    />
                </Col>
                <Col xs={24} md={12}>
                    <Title>{tour.name}</Title>
                    <Paragraph>
                        <strong>Địa điểm:</strong> {tour.location}
                    </Paragraph>

                    {/* Giá tour */}
                    <Paragraph>
                        <strong>Giá: </strong>
                        {tour.discount ? (
                            <>
                                <span
                                    style={{
                                        textDecoration: "line-through",
                                        marginRight: 8,
                                    }}
                                >
                                    {formatCurrency(Number(tour.price))}
                                </span>
                                <span
                                    style={{ color: "#1677ff", fontWeight: "bold" }}
                                >
                                    {formatCurrency(Number(ticketPrice))}
                                </span>
                            </>
                        ) : (
                            <span style={{ color: "#1677ff", fontWeight: "bold" }}>
                                {formatCurrency(Number(ticketPrice))}
                            </span>
                        )}
                    </Paragraph>

                    {tour.discount && (
                        <Paragraph type="danger">
                            Giảm giá: {tour.discount.percentage}%
                        </Paragraph>
                    )}

                    <Paragraph>{tour.description}</Paragraph>
                    <Button type="primary" size="large" onClick={handleBooking}>
                        Đặt tour
                    </Button>
                </Col>
            </Row>

            <Modal
                title="Xác nhận đặt tour"
                open={isModalVisible}
                onOk={handleConfirmBooking}
                confirmLoading={confirmLoading}
                onCancel={() => setIsModalVisible(false)}
                okText="Xác nhận"
                cancelText="Hủy"
            >
                <div style={{ marginBottom: 12 }}>
                    <strong>Tour:</strong> {tour.name}
                </div>
                <div style={{ marginBottom: 12 }}>
                    <strong>Địa điểm:</strong> {tour.location}
                </div>
                <div style={{ marginBottom: 12 }}>
                    <strong>Giá mỗi vé:</strong> {formatCurrency(Number(ticketPrice))}
                </div>

                <div style={{ marginBottom: 12 }}>
                    <Row gutter={8} align="middle">
                        <Col>
                            <strong>Số lượng:</strong>
                        </Col>
                        <Col>
                            <InputNumber
                                min={1}
                                max={tour.available_people}
                                value={quantity}
                                onChange={(val) => setQuantity(val)}
                            />
                        </Col>
                    </Row>
                </div>

                <div style={{ marginBottom: 12 }}>
                    <strong>Tổng tiền:</strong> {formatCurrency(Number(totalPrice))}
                </div>

                {user && (
                    <>
                        <div style={{ marginBottom: 8 }}>
                            <strong>Người đặt:</strong> {user.firstname} {user.lastname}
                        </div>
                        <div style={{ marginBottom: 8 }}>
                            <strong>Email:</strong> {user.email}
                        </div>
                    </>
                )}
            </Modal>

            {/* Reviews */}
            <div style={{ marginTop: "40px" }}>
                <Title level={3}>Đánh giá từ khách hàng</Title>
                {loadingReviews ? (
                    <Spin tip="Đang tải đánh giá..." />
                ) : reviews.length === 0 ? (
                    <Paragraph>Chưa có đánh giá nào cho tour này.</Paragraph>
                ) : (
                    <List
                        itemLayout="horizontal"
                        dataSource={reviews}
                        renderItem={(review) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={
                                        <Avatar>
                                            {review.user?.firstname?.charAt(0) || "U"}
                                        </Avatar>
                                    }
                                    title={
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "10px",
                                            }}
                                        >
                                            <span>
                                                {review.user?.firstname} {review.user?.lastname}
                                            </span>
                                            <Rate disabled defaultValue={review.rating} />
                                        </div>
                                    }
                                    description={review.comment}
                                />
                            </List.Item>
                        )}
                    />
                )}
            </div>
        </div>
    );
};

export default TourDetail;
