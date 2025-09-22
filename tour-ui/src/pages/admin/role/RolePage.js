/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
    Button,
    Modal,
    Spin,
    Descriptions,
    Input,
    Switch,
    Card,
    Tooltip,
    Pagination,
    Popconfirm
} from 'antd';
import RoleList from './RoleList';
import RoleForm from './RoleForm';
import { PlusOutlined, UnorderedListOutlined, AppstoreOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { formatDate } from '../../../utils/helpers';
import axios from 'axios';
import toast from 'react-hot-toast';

const RolePage = () => {
    const [roles, setRoles] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [loading, setLoading] = useState(false);
    const [viewingRole, setViewingRole] = useState(null);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 6, total: 0 });
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState('list');

    const API_URL = process.env.REACT_APP_API_URL;

    const fetchData = async (page = 1, pageSize = 6, keyword = search) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/roles`, {
                params: { page, pageSize, search: keyword || null }
            });
            const { data, total } = response.data;
            setRoles(data);
            setPagination({ current: page, pageSize, total });
        } catch (err) {
            toast.error('Lỗi khi tải danh sách vai trò');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = () => {
        setEditingRole(null);
        setOpen(true);
    };

    const handleEdit = (role) => {
        setEditingRole(role);
        setOpen(true);
    };

    const handleView = (role) => {
        setViewingRole(role);
    };

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`${API_URL}/roles/${id}`);
            toast.success(res.data.message);

            const isLast = roles.length === 1 && pagination.current > 1;
            const newPage = isLast ? pagination.current - 1 : pagination.current;
            fetchData(newPage, pagination.pageSize);
        } catch (err) {
            toast.error('Xóa thất bại');
        }
    };

    const handleSubmit = async (role) => {
        try {
            let res;
            if (editingRole) {
                res = await axios.put(`${API_URL}/roles/${editingRole.id}`, role);
            } else {
                res = await axios.post(`${API_URL}/roles`, role);
            }
            if (res.data.success) {
                toast.success(res.data.message);
                fetchData(pagination.current, pagination.pageSize);
            } else {
                toast.error(res.data.message || 'Thao tác thất bại');
            }
            setOpen(false);
        } catch (err) {
            toast.error('Thao tác thất bại');
        }
    };

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2>Danh sách vai trò</h2>
                <div style={{ display: 'flex', gap: 8 }}>
                    <Input
                        placeholder="Tìm kiếm vai trò..."
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
                    <RoleList
                        data={roles}
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
                            {roles.map((role) => (
                                <Card
                                    key={role.id}
                                    size="small"
                                    actions={[
                                        <Tooltip title="Chi tiết" key="view"><EyeOutlined onClick={() => handleView(role)} /></Tooltip>,
                                        <Tooltip title="Chỉnh sửa" key="edit"><EditOutlined onClick={() => handleEdit(role)} /></Tooltip>,
                                        <Popconfirm
                                            title="Bạn có chắc chắn muốn xóa vai trò này?"
                                            okText="Xóa"
                                            cancelText="Hủy"
                                            okButtonProps={{ danger: true }}
                                            trigger="click"
                                            onConfirm={() => handleDelete(role.id)}
                                        >
                                            <span style={{ color: 'red', cursor: 'pointer' }}>
                                                <DeleteOutlined />
                                            </span>
                                        </Popconfirm>

                                    ]}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                        <div style={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: '50%',
                                            overflow: 'hidden',
                                            flexShrink: 0,
                                            backgroundColor: '#f0f0f0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 600,
                                            color: '#555'
                                        }}>
                                            {role.code?.substring(0, 2).toUpperCase()}
                                        </div>

                                        <div style={{ flex: 1 }}>
                                            <p style={{ margin: 0, fontWeight: 600 }}>{role.name}</p>
                                            <p style={{ margin: '4px 0' }}><b>Code:</b> {role.code}</p>
                                            <p style={{ margin: '4px 0' }}><b>Slug:</b> {role.slug}</p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

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
            <Modal open={open} onCancel={() => setOpen(false)} footer={null} destroyOnClose title={editingRole ? 'Cập nhật vai trò' : 'Thêm vai trò'}>
                <RoleForm
                    initialValues={editingRole}
                    onSubmit={handleSubmit}
                    onCancel={() => setOpen(false)}
                    roles={roles}
                />
            </Modal>

            {/* Modal chi tiết */}
            <Modal open={!!viewingRole} onCancel={() => setViewingRole(null)} centered footer={null} title="Chi tiết vai trò">
                {viewingRole && (
                    <Descriptions bordered column={1} size="middle">
                        <Descriptions.Item label="ID">{viewingRole.id}</Descriptions.Item>
                        <Descriptions.Item label="Code">{viewingRole.code}</Descriptions.Item>
                        <Descriptions.Item label="Tên vai trò">{viewingRole.name}</Descriptions.Item>
                        <Descriptions.Item label="Slug">{viewingRole.slug}</Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo">{formatDate(viewingRole.createdAt)}</Descriptions.Item>
                        <Descriptions.Item label="Ngày cập nhật">{formatDate(viewingRole.updatedAt)}</Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </div>
    );
};

export default RolePage;
