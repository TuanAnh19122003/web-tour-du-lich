import React, { useEffect } from "react";
import { Form, InputNumber, Input, Button, Space } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";

/**
 * Props:
 * - initialValues: object or null
 * - onSubmit(values): function
 * - onCancel(): function
 * - users: array of {id, lastname, firstname, email} (optional)
 * - tours: array of {id, name} (optional)
 */
const ReviewForm = ({ initialValues, onSubmit, onCancel, users = [], tours = [] }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        // preset form values when editing
        if (initialValues) {
            form.setFieldsValue({
                rating: initialValues.rating,
                comment: initialValues.comment,
                userId: initialValues.userId,
                tourId: initialValues.tourId,
            });
        } else {
            form.resetFields();
        }
    }, [initialValues, form]);

    const handleFinish = (values) => {
        if (!values.rating || values.rating < 1 || values.rating > 5) {
            toast.error("Rating phải từ 1 đến 5");
            return;
        }
        onSubmit(values);
    };

    return (
        <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ rating: 5 }}>
            <Form.Item
                name="userId"
                label="Người dùng (ID)"
                rules={[{ required: true, message: "Vui lòng chọn người dùng (hoặc nhập ID)" }]}
            >
                {/* nếu bạn có danh sách users, nên dùng Select; giữ Input để đơn giản */}
                <Input placeholder="Nhập userId hoặc dùng Select nếu có danh sách" />
            </Form.Item>

            <Form.Item
                name="tourId"
                label="Tour (ID)"
                rules={[{ required: true, message: "Vui lòng chọn tour (hoặc nhập ID)" }]}
            >
                <Input placeholder="Nhập tourId hoặc dùng Select nếu có danh sách" />
            </Form.Item>

            <Form.Item
                name="rating"
                label="Rating (1-5)"
                rules={[{ required: true, message: "Vui lòng nhập rating" }]}
            >
                <InputNumber min={1} max={5} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="comment" label="Bình luận">
                <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item>
                <Space>
                    <Button type="primary" htmlType="submit" icon={<CheckOutlined />}>Lưu</Button>
                    <Button onClick={onCancel} icon={<CloseOutlined />}>Hủy</Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default ReviewForm;
