/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Button, Modal, Spin, Descriptions, Input, Card, Tooltip, Popconfirm, Pagination, Switch } from 'antd';
import ContactForm from './ContactForm';
import ContactList from './ContactList';
import { PlusOutlined, UnorderedListOutlined, AppstoreOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from 'axios';
import { formatDate } from '../../../utils/helpers';
import toast from 'react-hot-toast';

const ContactPage = () => {
    const [contacts, setContacts] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingContact, setEditingContact] = useState(null);
    const [loading, setLoading] = useState(false);
    const [viewingContact, setViewingContact] = useState(null);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState('list');

    const API_URL = process.env.REACT_APP_API_URL;

    const fetchContact = async (page = 1, pageSize = 5, keyword = search) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/contacts`, {
                params: { page, pageSize, search: keyword || null },
            });
            const { data, total } = response.data;
            setContacts(data);
            setPagination({ current: page, pageSize, total });
        } catch (error) {
            toast.error('Lỗi khi tải danh sách liên hệ');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContact();
    }, []);

    const handleAdd = () => setOpen(true);
    const handleEdit = (contact) => { setEditingContact(contact); setOpen(true); };
    const handleView = (contact) => setViewingContact(contact);

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/contacts/${id}`);
            toast.success(response.data.message);

            const remainingItems = contacts.length - 1;
            const isLastItemOnPage = remainingItems === 0 && pagination.current > 1;
            const newPage = isLastItemOnPage ? pagination.current - 1 : pagination.current;

            fetchContact(newPage, pagination.pageSize);
        } catch (error) {
            toast.error('Xóa thất bại');
        }
    };

    const handleSubmit = async (contact) => {
        try {
            if (editingContact) {
                const response = await axios.put(`${API_URL}/contacts/${editingContact.id}`, contact);
                if (response.data.success) {
                    toast.success(response.data.message);
                    fetchContact(pagination.current, pagination.pageSize);
                } else {
                    toast.error(response.data.message || "Cập nhật thất bại");
                }
            } else {
                const response = await axios.post(`${API_URL}/contacts`, contact);
                toast.success(response.data.message);
                fetchContact(1, pagination.pageSize);
            }
            setOpen(false);
        } catch (error) {
            toast.error('Thao tác thất bại');
        }
    };

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2>Danh sách liên hệ</h2>
                <div style={{ display: 'flex', gap: 8 }}>
                    <Input
                        placeholder="Tìm kiếm liên hệ..."
                        value={search}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSearch(value);
                            fetchContact(1, pagination.pageSize, value);
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
                    <ContactList
                        data={contacts}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onView={handleView}
                        pagination={pagination}
                        onPageChange={fetchContact}
                    />
                ) : (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                            {contacts.map(contact => (
                                <Card
                                    key={contact.id}
                                    size="small"
                                    actions={[
                                        <Tooltip title="Chi tiết" key="view"><EyeOutlined onClick={() => handleView(contact)} /></Tooltip>,
                                        <Tooltip title="Chỉnh sửa" key="edit"><EditOutlined onClick={() => handleEdit(contact)} /></Tooltip>,
                                        <Popconfirm key="delete" title="Bạn có chắc muốn xóa?" onConfirm={() => handleDelete(contact.id)}>
                                            <DeleteOutlined style={{ color: 'red' }} />
                                        </Popconfirm>
                                    ]}
                                >
                                    <p style={{ margin: 0, fontWeight: 600 }}>{contact.name}</p>
                                    <p style={{ margin: 0 }}><b>Email:</b> {contact.email}</p>
                                    <p style={{ margin: 0 }}><b>Phone:</b> {contact.phone}</p>
                                    <p style={{ margin: 0 }}><b>Tiêu đề:</b> {contact.subject}</p>
                                    <p style={{ margin: 0 }}><b>Nội dung:</b> {contact.message}</p>
                                </Card>
                            ))}
                        </div>
                        <div style={{ textAlign: 'center', marginTop: 16 }}>
                            <Pagination
                                current={pagination.current}
                                pageSize={pagination.pageSize}
                                total={pagination.total}
                                onChange={(page) => fetchContact(page, pagination.pageSize)}
                            />
                        </div>
                    </>
                )}
            </Spin>

            {/* Modal thêm/sửa */}
            <Modal open={open} onCancel={() => setOpen(false)} footer={null} destroyOnClose title={editingContact ? 'Cập nhật liên hệ' : 'Thêm liên hệ'}>
                <ContactForm initialValues={editingContact} onSubmit={handleSubmit} onCancel={() => setOpen(false)} />
            </Modal>

            {/* Modal chi tiết */}
            <Modal open={!!viewingContact} onCancel={() => setViewingContact(null)} footer={null} title="Chi tiết liên hệ" centered>
                {viewingContact && (
                    <Descriptions bordered column={1} size="middle">
                        <Descriptions.Item label="ID">{viewingContact.id}</Descriptions.Item>
                        <Descriptions.Item label="Tên người gửi">{viewingContact.name}</Descriptions.Item>
                        <Descriptions.Item label="Email">{viewingContact.email}</Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">{viewingContact.phone}</Descriptions.Item>
                        <Descriptions.Item label="Tiêu đề">{viewingContact.subject}</Descriptions.Item>
                        <Descriptions.Item label="Nội dung">{viewingContact.message}</Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo">{formatDate(viewingContact.createdAt)}</Descriptions.Item>
                        <Descriptions.Item label="Ngày cập nhật">{formatDate(viewingContact.updatedAt)}</Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </div>
    );
};

export default ContactPage;
