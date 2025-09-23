import React from "react";
import { Form, Input, Button, Select } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const BookingForm = ({ users, initialValues, onSubmit, onCancel }) => {
    const [form] = Form.useForm();

    const handleFinish = (values) => {
        onSubmit(values);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={{
                status: "pending",
                paymentMethod: "cod",
                ...initialValues,
            }}
        >
            <Form.Item
                name="userId"
                label="Khách hàng"
                rules={[{ required: true, message: "Vui lòng chọn khách hàng!" }]}
            >
                <Select placeholder="Chọn khách hàng">
                    {users.map((u) => (
                        <Select.Option key={u.id} value={u.id}>
                            {u.lastname} {u.firstname} ({u.email})
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item name="note" label="Ghi chú">
                <Input.TextArea rows={3} />
            </Form.Item>

            <Form.Item name="status" label="Trạng thái">
                <Select>
                    <Select.Option value="pending">Pending</Select.Option>
                    <Select.Option value="paid">Paid</Select.Option>
                    <Select.Option value="cancelled">Cancelled</Select.Option>
                    <Select.Option value="completed">Completed</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item name="paymentMethod" label="Phương thức thanh toán">
                <Select>
                    <Select.Option value="cod">COD</Select.Option>
                    <Select.Option value="paypal">Paypal</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" icon={<CheckOutlined />}>
                    Lưu
                </Button>
                <Button
                    style={{ marginLeft: 8 }}
                    onClick={onCancel}
                    icon={<CloseOutlined />}
                >
                    Hủy
                </Button>
            </Form.Item>
        </Form>
    );
};

export default BookingForm;
