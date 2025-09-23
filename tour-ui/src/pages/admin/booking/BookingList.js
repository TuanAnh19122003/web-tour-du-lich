import React from "react";
import { Table, Tag, Dropdown, Button } from "antd";
import {
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    MoreOutlined,
} from "@ant-design/icons";
import { formatCurrency } from '../../../utils/helpers';

const BookingList = ({
    data,
    pagination,
    onPageChange,
    onView,
    onEdit,
    onDelete,
}) => {
    const columns = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            render: (_, __, index) =>
                (pagination.current - 1) * pagination.pageSize + index + 1,
        },
        {
            title: "Khách hàng",
            dataIndex: "user",
            key: "user",
            render: (user) =>
                user ? (
                    <>
                        {user.lastname} {user.firstname} <br />
                        <small style={{ color: "#888" }}>{user.email}</small>
                    </>
                ) : (
                    <Tag color="red">N/A</Tag>
                ),
        },
        {
            title: "Tổng tiền",
            dataIndex: "total_price",
            key: "total_price",
            render: (value) =>
                value ? formatCurrency(Number(value)) : "0 ₫",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                const colors = {
                    pending: "orange",
                    paid: "blue",
                    cancelled: "red",
                    completed: "green",
                };
                return <Tag color={colors[status]}>{status}</Tag>;
            },
        },
        {
            title: "Thanh toán",
            dataIndex: "paymentMethod",
            key: "paymentMethod",
            render: (method) => (
                <Tag color={method === "paypal" ? "blue" : "green"}>
                    {method.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_, record) => {
                const items = [
                    {
                        key: "view",
                        label: (
                            <div onClick={() => onView(record)}>
                                <EyeOutlined style={{ marginRight: 8 }} /> Xem chi tiết
                            </div>
                        ),
                    },
                    {
                        key: "edit",
                        label: (
                            <div onClick={() => onEdit(record)}>
                                <EditOutlined style={{ marginRight: 8 }} /> Chỉnh sửa
                            </div>
                        ),
                    },
                    {
                        key: "delete",
                        label: (
                            <div
                                style={{ color: "red" }}
                                onClick={() => onDelete(record.id)}
                            >
                                <DeleteOutlined style={{ marginRight: 8 }} /> Xóa
                            </div>
                        ),
                    },
                ];
                return (
                    <Dropdown menu={{ items }} trigger={["click"]}>
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

export default BookingList;
