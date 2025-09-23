import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Upload, message, Card, Typography, Avatar, Row, Col, Divider } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import normalizeFileName from '../../utils/normalizeFileName';

const { Title } = Typography;

const Profile = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [userData, setUserData] = useState({});
    const [file, setFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            message.warning('Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.');
            navigate('/auth/login');
        }
    }, [navigate]);

    useEffect(() => {
        if (storedUser && storedUser.id && !userData.id) {
            form.setFieldsValue({
                firstname: storedUser.firstname,
                lastname: storedUser.lastname,
                email: storedUser.email,
                phone: storedUser.phone,
            });
            setUserData(storedUser);
        }
    }, [form, userData, storedUser]);

    const handleUploadChange = ({ fileList }) => {
        const rawFile = fileList?.[0]?.originFileObj;
        if (!rawFile || !(rawFile instanceof Blob)) {
            message.error('Tệp không hợp lệ!');
            return;
        }
        const newFileName = normalizeFileName(rawFile.name);
        const renamedFile = new File([rawFile], newFileName, { type: rawFile.type, lastModified: rawFile.lastModified });
        setFile(renamedFile);

        const reader = new FileReader();
        reader.onload = () => setPreviewImage(reader.result);
        reader.readAsDataURL(renamedFile);
    };

    const onFinish = async (values) => {
        setLoading(true);
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
            if (key === 'password' && !values[key]) return;
            formData.append(key, values[key]);
        });
        if (file) formData.append('image', file);

        try {
            const res = await axios.put(`${API_URL}/users/${storedUser.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            message.success(res.data.message || 'Cập nhật thành công');

            const updatedUser = { ...res.data.data, role: storedUser.role || res.data.data.role };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUserData(updatedUser);
            setPreviewImage(null);
            setFile(null);
            setIsEditing(false);

            window.dispatchEvent(new Event('userUpdated'));
        } catch (error) {
            message.error(error?.response?.data?.message || 'Cập nhật thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
            <Card
                style={{ width: 800, borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                title={<Title level={4}>Thông tin cá nhân</Title>}
            >
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Row gutter={24}>
                        {/* Avatar và upload */}
                        <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
                            {(previewImage || userData.image) ? (
                                <Avatar
                                    size={160}
                                    src={previewImage || `http://localhost:5000/${userData.image}`}
                                    style={{
                                        marginBottom: 16,
                                        borderRadius: 8,
                                        width: 200,
                                        height: 320,
                                        objectFit: 'cover'
                                    }}
                                />
                            ) : (
                                <Avatar
                                    size={160}
                                    icon={<UserOutlined />}
                                    style={{
                                        marginBottom: 16,
                                        borderRadius: 8,
                                        width: 200,
                                        height: 320,
                                        objectFit: 'cover'
                                    }}
                                />
                            )}


                            {isEditing && (
                                <Upload
                                    showUploadList={false}
                                    beforeUpload={() => false}
                                    onChange={handleUploadChange}
                                    accept="image/*"
                                    maxCount={1}
                                >
                                    <Button icon={<UploadOutlined />}>Thay ảnh</Button>
                                </Upload>
                            )}
                        </Col>

                        {/* Form thông tin */}
                        <Col xs={24} sm={16}>
                            <Form.Item label="Họ" name="lastname" rules={[{ required: true, message: 'Vui lòng nhập họ' }]}>
                                <Input disabled={!isEditing} />
                            </Form.Item>
                            <Form.Item label="Tên" name="firstname" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
                                <Input disabled={!isEditing} />
                            </Form.Item>
                            <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
                                <Input disabled />
                            </Form.Item>
                            <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true }]}>
                                <Input disabled={!isEditing} />
                            </Form.Item>
                            {isEditing && (
                                <Form.Item label="Mật khẩu mới" name="password">
                                    <Input.Password placeholder="Để trống nếu không đổi" />
                                </Form.Item>
                            )}
                        </Col>
                    </Row>

                    <Divider />

                    <Form.Item style={{ textAlign: 'right' }}>
                        {isEditing ? (
                            <>
                                <Button
                                    style={{ marginRight: 8 }}
                                    onClick={() => {
                                        setIsEditing(false);
                                        form.setFieldsValue({
                                            firstname: userData.firstname,
                                            lastname: userData.lastname,
                                            email: userData.email,
                                            phone: userData.phone,
                                        });
                                        setPreviewImage(null);
                                        setFile(null);
                                    }}
                                >
                                    Hủy
                                </Button>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Lưu
                                </Button>
                            </>
                        ) : (
                            <Button type="primary" onClick={() => setIsEditing(true)}>
                                Chỉnh sửa
                            </Button>
                        )}
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Profile;
