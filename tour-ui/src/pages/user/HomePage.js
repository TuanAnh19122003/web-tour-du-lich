import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Row,
    Col,
    Card,
    Carousel,
    Typography,
    Button,
    Badge,
    Avatar,
    Rate,
} from "antd";

const { Title, Paragraph } = Typography;

const HomePage = () => {
    const [featuredTours, setFeaturedTours] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/tours/featured")
            .then((res) => setFeaturedTours(res.data.data))
            .catch((err) => console.error(err));

        axios.get("http://localhost:5000/api/tours/destinations")
            .then((res) => setDestinations(res.data.data))
            .catch((err) => console.error(err));

        axios.get("http://localhost:5000/api/reviews?page=1&pageSize=5")
            .then((res) => setReviews(res.data.data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <section
                style={{
                    backgroundImage: "url('/banner.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "70vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    color: "white",
                }}
            >
                <div style={{ background: "rgba(0,0,0,0.4)", padding: "40px", borderRadius: "12px" }}>
                    <Title style={{ color: "white", fontSize: "48px" }}>
                        Khám phá thế giới cùng chúng tôi
                    </Title>
                    <Paragraph style={{ color: "white", fontSize: "18px" }}>
                        Đặt tour du lịch dễ dàng, nhanh chóng và giá tốt nhất
                    </Paragraph>
                    <Button type="primary" size="large" shape="round">
                        Bắt đầu ngay
                    </Button>
                </div>
            </section>

            {/* Featured Tours */}
            <section style={{ padding: "60px 40px", background: "#f9f9f9" }}>
                <Title level={2} style={{ textAlign: "center", marginBottom: "40px" }}>
                    Tour nổi bật
                </Title>
                <Row gutter={[24, 24]}>
                    {featuredTours.map((tour) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={tour.id}>
                            <Badge.Ribbon
                                text={tour.discount ? `-${tour.discount.percentage}%` : ""}
                                color="red"
                            >
                                <Card
                                    hoverable
                                    cover={
                                        <img
                                            alt={tour.name}
                                            src={`http://localhost:5000/${tour.image}`}
                                            style={{ height: "220px", objectFit: "cover" }}
                                        />
                                    }
                                >
                                    <Card.Meta
                                        title={tour.name}
                                        description={tour.location}
                                    />
                                    <Paragraph strong style={{ marginTop: "10px", color: "#1677ff" }}>
                                        {tour.price} đ
                                    </Paragraph>
                                </Card>
                            </Badge.Ribbon>
                        </Col>
                    ))}
                </Row>
            </section>

            {/* Destinations */}
            <section style={{ padding: "60px 40px" }}>
                <Title level={2} style={{ textAlign: "center", marginBottom: "40px" }}>
                    Điểm đến phổ biến
                </Title>
                <Row gutter={[24, 24]} justify="center">
                    {destinations.map((d, idx) => (
                        <Col xs={12} sm={8} md={6} lg={4} key={idx}>
                            <div style={{ textAlign: "center" }}>
                                <Avatar
                                    size={120}
                                    src={`http://localhost:5000/${d.image}`}
                                    style={{ border: "3px solid #1677ff" }}
                                />
                                <Paragraph strong style={{ marginTop: "10px" }}>
                                    {d.location}
                                </Paragraph>
                            </div>
                        </Col>
                    ))}
                </Row>
            </section>

            {/* Reviews */}
            <section style={{ padding: "60px 40px", background: "#fafafa" }}>
                <Title level={2} style={{ textAlign: "center", marginBottom: "40px" }}>
                    Khách hàng nói gì?
                </Title>
                <Carousel autoplay dots>
                    {reviews.map((review) => (
                        <div key={review.id}>
                            <Card
                                style={{
                                    maxWidth: "600px",
                                    margin: "0 auto",
                                    textAlign: "center",
                                }}
                            >
                                <Paragraph italic>“{review.comment}”</Paragraph>
                                <Rate disabled defaultValue={review.rating} />
                                <Paragraph style={{ marginTop: "10px", fontWeight: "bold" }}>
                                    — {review.user?.firstname} {review.user?.lastname}
                                </Paragraph>
                            </Card>
                        </div>
                    ))}
                </Carousel>
            </section>
        </div>
    );
};

export default HomePage;
