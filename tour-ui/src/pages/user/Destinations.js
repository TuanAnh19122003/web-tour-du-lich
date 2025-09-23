import React, { useEffect, useState } from "react";
import { Row, Col, Card, Typography, Spin, message, Button } from "antd";
import axios from "axios";

const { Title } = Typography;

const Destinations = () => {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDestinations = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/tours/destinations`);
                setDestinations(res.data.data);
            } catch (error) {
                console.error(error);
                message.error("Lấy danh sách điểm đến thất bại");
            } finally {
                setLoading(false);
            }
        };
        fetchDestinations();
    }, []);

    return (
        <div style={{ padding: 40, maxWidth: 1200, margin: "0 auto" }}>
            <Title level={2} style={{ textAlign: "center", marginBottom: 40 }}>
                Điểm đến nổi bật
            </Title>

            {loading ? (
                <div style={{ textAlign: "center", padding: 50 }}>
                    <Spin size="large" />
                </div>
            ) : (
                <Row gutter={[24, 24]}>
                    {destinations.map(dest => (
                        <Col xs={24} sm={12} md={8} key={dest.location}>
                            <Card
                                hoverable
                                cover={
                                    <img
                                        alt={dest.location}
                                        src={`http://localhost:5000/${dest.image}`}
                                        style={{
                                            height: 220,
                                            objectFit: "cover",
                                            borderTopLeftRadius: 8,
                                            borderTopRightRadius: 8
                                        }}
                                    />
                                }
                                style={{ borderRadius: 8 }}
                            >
                                <Title level={4}>{dest.location}</Title>
                                <Button type="primary" block>
                                    Xem tour
                                </Button>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default Destinations;
