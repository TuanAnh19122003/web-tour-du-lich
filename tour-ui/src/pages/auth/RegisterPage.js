import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const RegisterPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/auth/register`,
                values
            );
            if (res.data.success) {
                message.success("Đăng ký thành công!");
                navigate("/auth/login");
            } else {
                message.error(res.data.message || "Đăng ký thất bại!");
            }
        } catch (error) {
            console.error(error);
            message.error("Đăng ký thất bại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Title
                level={2}
                style={{
                    textAlign: "center",
                    color: "#0072ff",
                    marginBottom: 24,
                }}
            >
                Đăng ký
            </Title>

            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="Họ"
                    name="lastname"
                    rules={[{ required: true, message: "Vui lòng nhập họ" }]}
                >
                    <Input placeholder="Nhập họ" />
                </Form.Item>

                <Form.Item
                    label="Tên"
                    name="firstname"
                    rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                >
                    <Input placeholder="Nhập tên" />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Vui lòng nhập email" },
                        { type: "email", message: "Email không hợp lệ" },
                    ]}
                >
                    <Input placeholder="Nhập email" />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
                >
                    <Input.Password placeholder="••••••••" />
                </Form.Item>

                <Form.Item
                    label="Nhập lại mật khẩu"
                    name="password_confirmation"
                    dependencies={["password"]}
                    rules={[
                        { required: true, message: "Vui lòng nhập lại mật khẩu" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("password") === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error("Mật khẩu không khớp"));
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="••••••••" />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loading}
                        style={{
                            height: 40,
                            borderRadius: 8,
                            background: "linear-gradient(90deg,#00c6ff,#0072ff)",
                            border: "none",
                        }}
                    >
                        Đăng ký
                    </Button>
                </Form.Item>

                <div style={{ textAlign: "center", marginTop: 12 }}>
                    <Text>Bạn đã có tài khoản? </Text>
                    <Link to="/auth/login" style={{ color: "#0072ff", fontWeight: 500 }}>
                        Đăng nhập ngay
                    </Link>
                </div>
            </Form>
        </div>
    );
};

export default RegisterPage;
