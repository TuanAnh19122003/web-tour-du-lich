import React from "react";
import { Table, Button, Dropdown, Tag } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, MoreOutlined } from "@ant-design/icons";
import { formatCurrency, formatDate } from "../../../utils/helpers";

const TourList = ({ data, onView, onEdit, onDelete, pagination, onPageChange, discounts }) => {
    const columns = [
        {
            title: "STT",
            render: (_, __, index) => <span>{(pagination.current - 1) * pagination.pageSize + index + 1}</span>,
        },
        { title: "Mã", dataIndex: "code" },
        { title: "Tên tour", dataIndex: "name" },
        { title: "Địa điểm", dataIndex: "location" },
        {
            title: "Giá",
            dataIndex: "price",
            render: (val) => formatCurrency(Number(val)),
        },
        {
            title: "Ngày bắt đầu",
            dataIndex: "start_date",
            render: (val) => formatDate(val),
        },
        {
            title: "Ngày kết thúc",
            dataIndex: "end_date",
            render: (val) => formatDate(val),
        },
        {
            title: "Trạng thái",
            dataIndex: "is_active",
            render: (val) => (val ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Ngừng</Tag>),
        },
        {
            title: "Hành động",
            render: (_, record) => {
                const items = [
                    { key: "view", label: <div onClick={() => onView(record)}><EyeOutlined /> Xem</div> },
                    { key: "edit", label: <div onClick={() => onEdit(record)}><EditOutlined /> Sửa</div> },
                    { key: "delete", label: <div onClick={() => onDelete(record.id)} style={{ color: "red" }}><DeleteOutlined /> Xóa</div> },
                ];
                return (
                    <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
                        <Button shape="circle" icon={<MoreOutlined />} />
                    </Dropdown>
                );
            },
        },
    ];

    return (
        <Table
            rowKey="id"
            dataSource={data}
            columns={columns}
            pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: false,
                onChange: (page, pageSize) => onPageChange(page, pageSize),
            }}
        />
    );
};

export default TourList;
