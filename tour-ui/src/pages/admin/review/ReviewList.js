import React from "react";
import { Table, Tag, Button, Dropdown } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, MoreOutlined } from "@ant-design/icons";
import { formatDate } from "../../../utils/helpers";

const ReviewList = ({ data = [], onView, onEdit, onDelete, pagination, onPageChange }) => {
    const columns = [
        {
            title: "STT",
            render: (_, __, index) => <span>{(pagination.current - 1) * pagination.pageSize + index + 1}</span>,
            width: 70
        },
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 80
        },
        {
            title: "Người đánh giá",
            dataIndex: "user",
            key: "user",
            render: (user, record) => {
                // API có thể trả user object hoặc chỉ userId
                if (!user) return `ID: ${record.userId}`;
                return `${user.lastname || ""} ${user.firstname || ""} (${user.email || record.userId})`;
            }
        },
        {
            title: "Tour",
            dataIndex: "tour",
            key: "tour",
            render: (tour, record) => (tour ? tour.name : `ID: ${record.tourId}`)
        },
        {
            title: "Rating",
            dataIndex: "rating",
            key: "rating",
            width: 110,
            render: (rating) => <Tag color={rating >= 4 ? "green" : rating === 3 ? "gold" : "red"}>{rating}</Tag>
        },
        {
            title: "Bình luận",
            dataIndex: "comment",
            key: "comment",
            ellipsis: true
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 180,
            render: (val) => formatDate(val)
        },
        {
            title: "Hành động",
            key: "action",
            width: 120,
            render: (_, record) => {
                const items = [
                    {
                        key: "view",
                        label: <div onClick={() => onView(record)}><EyeOutlined style={{ marginRight: 8 }} /> Xem</div>
                    },
                    {
                        key: "edit",
                        label: <div onClick={() => onEdit(record)}><EditOutlined style={{ marginRight: 8 }} /> Sửa</div>
                    },
                    {
                        key: "delete",
                        label: <div onClick={() => onDelete(record.id)} style={{ color: "red" }}><DeleteOutlined style={{ marginRight: 8 }} /> Xóa</div>
                    }
                ];
                return (
                    <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
                        <Button shape="circle" icon={<MoreOutlined />} />
                    </Dropdown>
                );
            }
        }
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
                onChange: (page, pageSize) => onPageChange(page, pageSize)
            }}
        />
    );
};

export default ReviewList;
