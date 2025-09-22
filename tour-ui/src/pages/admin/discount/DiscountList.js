import React from "react";
import { Table, Button, Dropdown, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";

const DiscountList = ({ data, onEdit, onDelete, onView, pagination, onPageChange }) => {
    const columns = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            render: (_, __, index) => (
                <span>{(pagination.current - 1) * pagination.pageSize + index + 1}</span>
            ),
        },
        {
            title: "Tên chương trình",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
            ellipsis: true,
        },
        {
            title: "Giảm (%)",
            dataIndex: "percentage",
            key: "percentage",
            render: (value) => <span>{value}%</span>,
        },
        {
            title: "Ngày bắt đầu",
            dataIndex: "start_date",
            key: "start_date",
            render: (date) => date ? new Date(date).toLocaleDateString() : '-',
        },
        {
            title: "Ngày kết thúc",
            dataIndex: "end_date",
            key: "end_date",
            render: (date) => date ? new Date(date).toLocaleDateString() : '-',
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => {
                const items = [
                    {
                        key: 'view',
                        label: (
                            <div onClick={() => onView(record)}>
                                <EyeOutlined style={{ marginRight: 8 }} /> Xem chi tiết
                            </div>
                        ),
                    },
                    {
                        key: 'edit',
                        label: (
                            <div onClick={() => onEdit(record)}>
                                <EditOutlined style={{ marginRight: 8 }} /> Chỉnh sửa
                            </div>
                        ),
                    },
                    {
                        key: 'delete',
                        label: (
                            <Popconfirm
                                title={`Bạn có chắc chắn xoá chương trình "${record.name}" không?`}
                                onConfirm={() => onDelete(record.id)}
                            >
                                <div style={{ color: 'red' }}>
                                    <DeleteOutlined style={{ marginRight: 8 }} /> Xóa
                                </div>
                            </Popconfirm>
                        ),
                    },
                ];

                return (
                    <Dropdown
                        menu={{ items }}
                        trigger={['click']}
                        placement="bottomRight"
                    >
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
                onChange: (page, pageSize) => onPageChange(page, pageSize)
            }}
        />
    );
}

export default DiscountList;
