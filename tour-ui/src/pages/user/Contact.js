import React, { useState } from 'react';
import { Row, Col, Form, Input, Button, Card, Typography, Divider } from 'antd';
import { MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import axios from 'axios';
import toast from 'react-hot-toast';

const { Title } = Typography;
const { TextArea } = Input;

const Contact = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/contacts`, values);
            if (response.data.success) {
                toast.success(response.data.message || 'Gửi liên hệ thành công!');
                form.resetFields();
            } else {
                toast.error(response.data.message || 'Gửi thất bại!');
            }
        } catch (error) {
            toast.error('Gửi liên hệ thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "40px", maxWidth: 1200, margin: "0 auto" }}>
            <Title level={2} style={{ textAlign: "center", marginBottom: 40 }}>
                Liên hệ với chúng tôi
            </Title>

            <Row gutter={[32, 32]}>
                {/* Form liên hệ */}
                <Col xs={24} md={12}>
                    <Card
                        title="Gửi thông tin liên hệ"
                        style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    >
                        <Form layout="vertical" form={form} onFinish={handleSubmit}>
                            <Form.Item
                                name="name"
                                label="Họ và tên"
                                rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                            >
                                <Input placeholder="Nhập họ và tên" />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email' },
                                    { type: 'email', message: 'Email không hợp lệ' }
                                ]}
                            >
                                <Input placeholder="Nhập email" />
                            </Form.Item>

                            <Form.Item
                                name="phone"
                                label="Số điện thoại"
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                            >
                                <Input placeholder="Nhập số điện thoại" />
                            </Form.Item>

                            <Form.Item
                                name="subject"
                                label="Tiêu đề"
                                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                            >
                                <Input placeholder="Nhập tiêu đề" />
                            </Form.Item>

                            <Form.Item
                                name="message"
                                label="Nội dung"
                                rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
                            >
                                <TextArea rows={5} placeholder="Nhập nội dung liên hệ..." />
                            </Form.Item>

                            <Form.Item style={{ textAlign: 'right' }}>
                                <Button type="primary" htmlType="submit" loading={loading} size="large">
                                    Gửi liên hệ
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                {/* Thông tin liên hệ */}
                <Col xs={24} md={12}>
                    <Card
                        title="Thông tin liên hệ"
                        style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    >
                        <div style={{ marginBottom: 16 }}>
                            <p><HomeOutlined style={{ marginRight: 8, color: '#1890ff' }} /> 123 Đường ABC, Quận 1, TP.HCM</p>
                            <p><PhoneOutlined style={{ marginRight: 8, color: '#52c41a' }} /> 0909 123 456</p>
                            <p><MailOutlined style={{ marginRight: 8, color: '#faad14' }} /> contact@company.com</p>
                        </div>

                        <Divider />

                        <div style={{ borderRadius: 12, overflow: 'hidden' }}>
                            <iframe
                                title="Google Maps"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.123456789!2d106.681!3d10.762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x123456789%3A0xabcdef!2sHonda%20Shop!5e0!3m2!1sen!2s!4v1718800000000!5m2!1sen!2s"
                                width="100%"
                                height="300"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Contact;
