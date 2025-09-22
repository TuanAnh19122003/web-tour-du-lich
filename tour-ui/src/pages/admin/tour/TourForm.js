import React from "react";
import { Form, Input, InputNumber, DatePicker, Switch, Select, Upload, Button, Space } from "antd";
import { UploadOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const TourForm = ({ initialValues, onSubmit, onCancel, discounts }) => {
    const [form] = Form.useForm();

    const handleFinish = (values) => {
        onSubmit(values);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={initialValues || { is_active: true, is_featured: false }}
            onFinish={handleFinish}
        >
            <Form.Item name="code" label="Mã tour" rules={[{ required: true, message: "Vui lòng nhập mã tour!" }]}>
                <Input />
            </Form.Item>

            <Form.Item name="name" label="Tên tour" rules={[{ required: true, message: "Vui lòng nhập tên tour!" }]}>
                <Input />
            </Form.Item>

            <Form.Item name="slug" label="Slug">
                <Input />
            </Form.Item>

            <Form.Item name="description" label="Mô tả">
                <TextArea rows={4} />
            </Form.Item>

            <Form.Item name="image" label="Ảnh tour" valuePropName="fileList" getValueFromEvent={(e) => e?.fileList}>
                <Upload beforeUpload={() => false} listType="picture" maxCount={1}>
                    <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                </Upload>
            </Form.Item>

            <Form.Item name="price" label="Giá" rules={[{ required: true, message: "Vui lòng nhập giá!" }]}>
                <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="location" label="Địa điểm" rules={[{ required: true, message: "Vui lòng nhập địa điểm!" }]}>
                <Input />
            </Form.Item>

            <Form.Item name="max_people" label="Số người tối đa" rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="available_people" label="Số chỗ còn lại" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="start_date" label="Ngày bắt đầu" rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="end_date" label="Ngày kết thúc" rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="discountId" label="Giảm giá">
                <Select allowClear placeholder="Chọn giảm giá">
                    {discounts.map((d) => (
                        <Select.Option key={d.id} value={d.id}>
                            {d.name} ({d.percentage}%)
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item name="is_active" label="Trạng thái" valuePropName="checked">
                <Switch checkedChildren="Hoạt động" unCheckedChildren="Ngừng" />
            </Form.Item>

            <Form.Item name="is_featured" label="Nổi bật" valuePropName="checked">
                <Switch checkedChildren="Có" unCheckedChildren="Không" />
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

export default TourForm;
