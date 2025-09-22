import React from 'react';
import { Form, Input, Button, Space, message } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import slugify from 'slugify';

const RoleForm = ({ initialValues, onSubmit, onCancel, roles }) => {
    const [form] = Form.useForm();

    const handleFinish = (values) => {
        const isCodeExist = roles.some(
            (r) => r.code === values.code && r.id !== initialValues?.id
        );
        if (isCodeExist) {
            message.error("Mã vai trò đã tồn tại!");
            return;
        }

        const isNameExist = roles.some(
            (r) => r.name.toLowerCase() === values.name.toLowerCase() && r.id !== initialValues?.id
        );
        if (isNameExist) {
            message.error("Tên vai trò đã tồn tại!");
            return;
        }

        const slug = slugify(values.name, { lower: true, strict: true });
        onSubmit({ ...values, slug });
    };

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={initialValues || {}}
            onFinish={handleFinish}
        >
            <Form.Item
                name="code"
                label="Mã vai trò"
                rules={[{ required: true, message: 'Vui lòng nhập mã vai trò!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="name"
                label="Tên vai trò"
                rules={[{ required: true, message: 'Vui lòng nhập tên vai trò!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item>
                <Space>
                    <Button type="primary" htmlType="submit" icon={<CheckOutlined />}>
                        Lưu
                    </Button>
                    <Button onClick={onCancel} icon={<CloseOutlined />}>
                        Hủy
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default RoleForm;
