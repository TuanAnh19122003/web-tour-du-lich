/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
    Button,
    Modal,
    Spin,
    Descriptions,
    Input,
    Card,
    Tooltip,
    Pagination,
    Popconfirm,
    Switch
} from 'antd';
import DiscountList from './DiscountList';
import DiscountForm from './DiscountForm';
import { PlusOutlined, UnorderedListOutlined, AppstoreOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { formatDate } from '../../../utils/helpers';
import axios from 'axios';
import toast from "react-hot-toast";

const DiscountPage = () => {
    const [discounts, setDiscounts] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingDiscount, setEditingDiscount] = useState(null);
    const [loading, setLoading] = useState(false);
    const [viewingDiscount, setViewingDiscount] = useState(null);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 6, total: 0 });
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState('list'); // list | card

    const API_URL = process.env.REACT_APP_API_URL;

    const fetchData = async (page = 1, pageSize = 6, keyword = search) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/discounts`, {
                params: { page, pageSize, search: keyword || null }
            });
            const { data, total } = response.data;
            setDiscounts(data);
            setPagination({ current: page, pageSize, total });
        } catch (err) {
            toast.error('Lỗi khi tải danh sách giảm giá');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = () => {
        setEditingDiscount(null);
        setOpen(true);
    };

    const handleEdit = (discount) => {
        setEditingDiscount(discount);
        setOpen(true);
    };

    const handleView = (discount) => {
        setViewingDiscount(discount);
    };

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`${API_URL}/discounts/${id}`);
            toast.success(res.data.message);

            const isLast = discounts.length === 1 && pagination.current > 1;
            const newPage = isLast ? pagination.current - 1 : pagination.current;
            fetchData(newPage, pagination.pageSize);
        } catch (err) {
            toast.error('Xóa thất bại');
        }
    };

    const handleSubmit = async (discount) => {
        try {
            let res;
            if (editingDiscount) {
                res = await axios.put(`${API_URL}/discounts/${editingDiscount.id}`, discount);
            } else {
                res = await axios.post(`${API_URL}/discounts`, discount);
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
                <h2>Danh sách giảm giá</h2>
                <div style={{ display: 'flex', gap: 8 }}>
                    <Input
                        placeholder="Tìm kiếm giảm giá..."
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
                    <DiscountList
                        data={discounts}
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
                            {discounts.map((d) => (
                                <Card
                                    key={d.id}
                                    size="small"
                                    actions={[
                                        <Tooltip title="Chi tiết" key="view"><EyeOutlined onClick={() => handleView(d)} /></Tooltip>,
                                        <Tooltip title="Chỉnh sửa" key="edit"><EditOutlined onClick={() => handleEdit(d)} /></Tooltip>,
                                        <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => handleDelete(d.id)} key="delete">
                                            <DeleteOutlined style={{ color: 'red' }} />
                                        </Popconfirm>,
                                    ]}
                                >
                                    <p style={{ margin: 0, fontWeight: 600 }}>{d.name}</p>
                                    <p style={{ margin: 4 }}><b>Giảm:</b> {d.percentage}%</p>
                                    <p style={{ margin: 4 }}><b>Ngày bắt đầu:</b> {formatDate(d.start_date)}</p>
                                    <p style={{ margin: 4 }}><b>Ngày kết thúc:</b> {formatDate(d.end_date)}</p>
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
            <Modal open={open} onCancel={() => setOpen(false)} footer={null} destroyOnClose title={editingDiscount ? 'Cập nhật giảm giá' : 'Thêm giảm giá'}>
                <DiscountForm
                    initialValues={editingDiscount}
                    onSubmit={handleSubmit}
                    onCancel={() => setOpen(false)}
                    discounts={discounts}
                />
            </Modal>

            {/* Modal chi tiết */}
            <Modal open={!!viewingDiscount} onCancel={() => setViewingDiscount(null)} centered footer={null} title="Chi tiết giảm giá">
                {viewingDiscount && (
                    <Descriptions bordered column={1} size="middle">
                        <Descriptions.Item label="ID">{viewingDiscount.id}</Descriptions.Item>
                        <Descriptions.Item label="Tên chương trình">{viewingDiscount.name}</Descriptions.Item>
                        <Descriptions.Item label="Mô tả">{viewingDiscount.description}</Descriptions.Item>
                        <Descriptions.Item label="Giảm">{viewingDiscount.percentage}%</Descriptions.Item>
                        <Descriptions.Item label="Ngày bắt đầu">{formatDate(viewingDiscount.start_date)}</Descriptions.Item>
                        <Descriptions.Item label="Ngày kết thúc">{formatDate(viewingDiscount.end_date)}</Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo">{formatDate(viewingDiscount.createdAt)}</Descriptions.Item>
                        <Descriptions.Item label="Ngày cập nhật">{formatDate(viewingDiscount.updatedAt)}</Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </div>
    );
};

export default DiscountPage;
