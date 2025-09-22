/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
    Button,
    Modal,
    Spin,
    Descriptions,
    Tag,
    Input,
    Switch,
    Card,
    Tooltip,
    Popconfirm,
    Pagination
} from 'antd';
import UserList from './UserList';
import UserForm from './UserForm';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, UnorderedListOutlined, AppstoreOutlined } from '@ant-design/icons';
import axios from 'axios';
import { formatDate } from '../../../utils/helpers';
import normalizeFileName from '../../../utils/normalizeFileName';
import toast from 'react-hot-toast';

const UserPage = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [roleLoading, setRoleLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [viewingUser, setViewingUser] = useState(null);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 6, total: 0 });
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState('list'); // list | card

    const API_URL = process.env.REACT_APP_API_URL;

    const fetchData = async (page = 1, pageSize = 6, keyword = search) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/users`, {
                params: { page, pageSize, search: keyword || null },
            });
            const { data, total } = res.data;
            setUsers(data);
            setPagination({ current: page, pageSize, total });
        } catch (err) {
            toast.error('Lỗi khi tải người dùng');
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        setRoleLoading(true);
        try {
            const res = await axios.get(`${API_URL}/roles`);
            setRoles(res.data.data);
        } catch (err) {
            toast.error('Lỗi khi tải vai trò');
        } finally {
            setRoleLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        fetchRoles();
    }, []);

    const handleAdd = () => {
        setEditingUser(null);
        setOpen(true);
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setOpen(true);
    };

    const handleView = (user) => {
        setViewingUser(user);
    };

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`${API_URL}/users/${id}`);
            toast.success(res.data.message);

            // Xử lý trang nếu xóa item cuối cùng
            const isLast = users.length === 1 && pagination.current > 1;
            const newPage = isLast ? pagination.current - 1 : pagination.current;
            fetchData(newPage, pagination.pageSize);
        } catch (err) {
            toast.error('Xóa thất bại');
        }
    };

    const handleSubmit = async (user) => {
        try {
            const formData = new FormData();
            formData.append('firstname', user.firstname);
            formData.append('lastname', user.lastname);
            formData.append('email', user.email);
            formData.append('password', user.password);
            formData.append('roleId', user.roleId);
            formData.append('phone', user.phone);
            formData.append('is_active', user.is_active ? 1 : 0);

            if (Array.isArray(user.image) && user.image.length > 0) {
                const originalFile = user.image[0].originFileObj;
                const normalizedName = normalizeFileName(originalFile.name);
                const newFile = new File([originalFile], normalizedName, { type: originalFile.type });
                formData.append('image', newFile);
            }

            let res;
            if (editingUser) {
                res = await axios.put(`${API_URL}/users/${editingUser.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                res = await axios.post(`${API_URL}/users`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            }

            if (res.data.success) {
                toast.success(res.data.message);
                fetchData(pagination.current, pagination.pageSize);
            } else {
                toast.error(res.data.message || 'Thao tác thất bại');
            }
            setOpen(false);
        } catch (err) {
            console.error(err);
            toast.error('Thao tác thất bại');
        }
    };

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2>Danh sách người dùng</h2>
                <div style={{ display: 'flex', gap: 8 }}>
                    <Input
                        placeholder="Tìm kiếm người dùng..."
                        value={search}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSearch(value);
                            fetchData(1, pagination.pageSize, value);
                        }}
                        allowClear
                        style={{ width: 250 }}
                    />
                    <Switch
                        style={{ marginTop: 5 }}
                        checkedChildren={<AppstoreOutlined />}
                        unCheckedChildren={<UnorderedListOutlined />}
                        checked={viewMode === 'card'}
                        onChange={(checked) => setViewMode(checked ? 'card' : 'list')}
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm</Button>
                </div>
            </div>

            {/* Nội dung */}
            <Spin spinning={loading}>
                {viewMode === 'list' ? (
                    <UserList
                        data={users}
                        roles={roles}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onView={handleView}
                        pagination={pagination}
                        onPageChange={fetchData}
                    />
                ) : (
                    <>
                        {/* Card view */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                            {users.map((user) => (
                                <Card
                                    key={user.id}
                                    size="small"
                                    actions={[
                                        <Tooltip title="Chi tiết" key="view"><EyeOutlined onClick={() => handleView(user)} /></Tooltip>,
                                        <Tooltip title="Chỉnh sửa" key="edit"><EditOutlined onClick={() => handleEdit(user)} /></Tooltip>,
                                        <Popconfirm
                                            title="Bạn có chắc muốn xóa?"
                                            okText="Xóa"
                                            cancelText="Hủy"
                                            okButtonProps={{ danger: true }}
                                            onConfirm={() => handleDelete(user.id)}
                                            key="delete"
                                        >
                                            <DeleteOutlined style={{ color: 'red' }} />
                                        </Popconfirm>,
                                    ]}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                        {/* Ảnh đại diện */}
                                        <div style={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: '50%',
                                            overflow: 'hidden',
                                            flexShrink: 0,
                                            backgroundColor: '#f0f0f0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {user.image ? (
                                                <img
                                                    src={`http://localhost:5000/${user.image}`}
                                                    alt="avatar"
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <span style={{ color: '#aaa', fontSize: 12 }}>Không có</span>
                                            )}
                                        </div>

                                        {/* Thông tin */}
                                        <div style={{ flex: 1 }}>
                                            <p style={{ margin: 0, fontWeight: 600 }}>{user.lastname} {user.firstname}</p>
                                            <p style={{ margin: '4px 0' }}><b>Email:</b> {user.email}</p>
                                            <p style={{ margin: '4px 0' }}><b>Vai trò:</b> {roles.find(r => r.id === user.roleId)?.name || 'N/A'}</p>
                                            <p style={{ margin: '4px 0' }}>
                                                <b>Trạng thái:</b> {user.is_active ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Ngừng</Tag>}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination cho card view */}
                        <div style={{ textAlign: 'center', marginTop: 16 }}>
                            <Pagination
                                current={pagination.current}
                                pageSize={pagination.pageSize}
                                total={pagination.total}
                                onChange={(page) => fetchData(page, pagination.pageSize)}
                            />
                        </div>
                    </>
                )}
            </Spin>

            {/* Modal thêm/sửa */}
            <Modal open={open} onCancel={() => setOpen(false)} footer={null} destroyOnClose title={editingUser ? 'Cập nhật người dùng' : 'Thêm người dùng'}>
                <UserForm initialValues={editingUser} onSubmit={handleSubmit} onCancel={() => setOpen(false)} roles={roles} roleLoading={roleLoading} />
            </Modal>

            {/* Modal chi tiết */}
            <Modal open={!!viewingUser} onCancel={() => setViewingUser(null)} centered footer={null} title="Chi tiết người dùng">
                {viewingUser && (
                    <Descriptions bordered column={1} size="middle">
                        <Descriptions.Item label="ID">{viewingUser.id}</Descriptions.Item>
                        <Descriptions.Item label="Họ">{viewingUser.lastname}</Descriptions.Item>
                        <Descriptions.Item label="Tên">{viewingUser.firstname}</Descriptions.Item>
                        <Descriptions.Item label="Email">{viewingUser.email}</Descriptions.Item>
                        <Descriptions.Item label="Ảnh đại diện">
                            {viewingUser.image ? <img src={`http://localhost:5000/${viewingUser.image}`} alt="avatar" style={{ width: 100, height: 100, objectFit: 'contain', borderRadius: 10 }} /> : <span style={{ color: '#aaa' }}>Không có</span>}
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">{viewingUser.is_active ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Không hoạt động</Tag>}</Descriptions.Item>
                        <Descriptions.Item label="Vai trò">{roles.find(r => r.id === viewingUser.roleId)?.name || 'Không xác định'}</Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo">{formatDate(viewingUser.createdAt)}</Descriptions.Item>
                        <Descriptions.Item label="Ngày cập nhật">{formatDate(viewingUser.updatedAt)}</Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </div>
    );
};

export default UserPage;
