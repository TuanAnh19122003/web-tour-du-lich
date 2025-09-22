import React from 'react'
import { Table, Button, Dropdown, Tag } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";

const UserList = ({ data, onEdit, onDelete, onView, pagination, onPageChange, roles }) => {

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
            title: "Họ",
            dataIndex: "lastname",
            key: "lastname",
        },
        {
            title: "Tên",
            dataIndex: "firstname",
            key: "firstname",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Vai trò",
            dataIndex: "roleId",
            key: "roleId",
            render: (roleId) => roles.find(r => r.id === roleId)?.name || "Không xác định"
        },
        {
            title: "Trạng thái",
            dataIndex: "is_active",
            key: "is_active",
            render: (active) =>
                active ? (
                    <Tag color="green">Hoạt động</Tag>
                ) : (
                    <Tag color="red">Ngừng hoạt động</Tag>
                ),
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
                            <div
                                onClick={() => onDelete(record.id)}
                                style={{ color: 'red' }}
                            >
                                <DeleteOutlined style={{ marginRight: 8 }} /> Xóa
                            </div>
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
    )
}

export default UserList
