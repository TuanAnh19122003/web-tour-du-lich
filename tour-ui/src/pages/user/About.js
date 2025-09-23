import React from "react";
import { Row, Col, Typography, Card, Image } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import teamImage from "../../assets/team.jpg";
import missionImage from "../../assets/mission.jpg";

const { Title, Paragraph } = Typography;

const About = () => {
    return (
        <div style={{ padding: "60px 20px", maxWidth: 1200, margin: "0 auto" }}>
            <Title level={2} style={{ textAlign: "center", marginBottom: 50, color: "#1890ff" }}>
                Giới thiệu về Tour Việt Nam
            </Title>

            <Card
                bordered={false}
                style={{ marginBottom: 50, borderRadius: 16, boxShadow: "0 8px 20px rgba(0,0,0,0.1)" }}
            >
                <Row gutter={[32, 32]} align="middle">
                    <Col xs={24} md={12}>
                        <div style={{ width: '100%', height: 400, overflow: 'hidden', borderRadius: 16 }}>
                            <Image
                                src={missionImage}
                                alt="Sứ mệnh"
                                style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                                preview={false}
                            />
                        </div>
                    </Col>

                    <Col xs={24} md={12}>
                        <Title level={3} style={{ color: "#f11712" }}>Sứ mệnh của chúng tôi</Title>
                        <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
                            Tour Việt Nam cam kết mang đến cho du khách những trải nghiệm du lịch tuyệt vời,
                            an toàn và đáng nhớ. Chúng tôi luôn đặt chất lượng dịch vụ và sự hài lòng của khách hàng lên hàng đầu.
                        </Paragraph>
                        <ul style={{ listStyle: "none", padding: 0 }}>
                            <li><CheckCircleOutlined style={{ color: "#52c41a", marginRight: 8 }} /> Trải nghiệm du lịch đa dạng</li>
                            <li><CheckCircleOutlined style={{ color: "#52c41a", marginRight: 8 }} /> Hỗ trợ khách hàng 24/7</li>
                            <li><CheckCircleOutlined style={{ color: "#52c41a", marginRight: 8 }} /> Cam kết chất lượng dịch vụ</li>
                        </ul>
                    </Col>
                </Row>
            </Card>

            {/* Đội ngũ */}
            <Card
                bordered={false}
                style={{ marginBottom: 50, borderRadius: 16, boxShadow: "0 8px 20px rgba(0,0,0,0.1)" }}
            >
                <Row gutter={[32, 32]} align="middle">
                    <Col xs={24} md={12} order={1}>
                        <Image
                            src={teamImage}
                            alt="Đội ngũ"
                            style={{ borderRadius: 16, width: "100%", objectFit: "cover" }}
                            preview={false}
                        />
                    </Col>
                    <Col xs={24} md={12} order={2}>
                        <Title level={3} style={{ color: "#1890ff" }}>Đội ngũ của chúng tôi</Title>
                        <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
                            Đội ngũ nhân viên giàu kinh nghiệm, am hiểu văn hóa và điểm đến Việt Nam,
                            luôn sẵn sàng hỗ trợ bạn trong suốt hành trình. Chúng tôi tự hào về sự
                            chuyên nghiệp và tận tâm trong từng dịch vụ.
                        </Paragraph>
                        <ul style={{ listStyle: "none", padding: 0 }}>
                            <li><CheckCircleOutlined style={{ color: "#f11712", marginRight: 8 }} /> Hướng dẫn viên chuyên nghiệp</li>
                            <li><CheckCircleOutlined style={{ color: "#f11712", marginRight: 8 }} /> Đội ngũ tư vấn tận tâm</li>
                            <li><CheckCircleOutlined style={{ color: "#f11712", marginRight: 8 }} /> Hỗ trợ đa ngôn ngữ</li>
                        </ul>
                    </Col>
                </Row>
            </Card>

            {/* Call to action */}
            <Card
                bordered={false}
                style={{
                    marginTop: 20,
                    textAlign: "center",
                    background: "linear-gradient(135deg,#0099f7,#f11712)",
                    color: "#fff",
                    borderRadius: 16,
                    boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
                }}
            >
                <Title level={3} style={{ color: "#fff" }}>Hãy để chúng tôi đồng hành cùng bạn!</Title>
                <Paragraph style={{ color: "#fff", fontSize: 16 }}>
                    Liên hệ ngay để lên kế hoạch cho chuyến du lịch hoàn hảo.
                </Paragraph>
                <a
                    href="/contact"
                    style={{
                        display: "inline-block",
                        marginTop: 16,
                        padding: "10px 24px",
                        backgroundColor: "#fff",
                        color: "#f11712",
                        borderRadius: 8,
                        fontWeight: 600,
                        textDecoration: "none"
                    }}
                >
                    Liên hệ ngay
                </a>
            </Card>
        </div>
    );
};

export default About;
