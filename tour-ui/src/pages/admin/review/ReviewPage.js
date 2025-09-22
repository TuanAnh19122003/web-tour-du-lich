/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Button, Modal, Spin, Descriptions, Card, Tooltip, Popconfirm, Pagination, Input, Switch } from "antd";
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, UnorderedListOutlined, AppstoreOutlined } from "@ant-design/icons";
import axios from "axios";
import toast from "react-hot-toast";
import { formatDate } from "../../../utils/helpers";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";

const ReviewPage = () => {
    const [reviews, setReviews] = useState([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [viewing, setViewing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 8, total: 0 });
    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState("list");

    const API_URL = process.env.REACT_APP_API_URL;

    const fetchReviews = async (page = 1, pageSize = 8, keyword = search) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/reviews`, { params: { page, pageSize, search: keyword || null } });
            // Expect res.data = { data: [...], total: n }
            const { data, total } = res.data;
            setReviews(data || []);
            setPagination({ current: page, pageSize, total: total || 0 });
        } catch (err) {
            toast.error("Lỗi tải danh sách đánh giá");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/reviews/${id}`);
            toast.success("Xóa đánh giá thành công");
            const isLast = reviews.length === 1 && pagination.current > 1;
            fetchReviews(isLast ? pagination.current - 1 : pagination.current, pagination.pageSize);
        } catch (err) {
            toast.error("Xóa thất bại");
        }
    };

    const handleSubmit = async (payload) => {
        try {
            let res;
            if (editing) {
                res = await axios.put(`${API_URL}/reviews/${editing.id}`, payload);
            } else {
                res = await axios.post(`${API_URL}/reviews`, payload);
            }
            if (res.data.success) {
                toast.success(res.data.message || "Thao tác thành công");
                fetchReviews(pagination.current, pagination.pageSize);
                setOpen(false);
            } else {
                toast.error(res.data.message || "Thao tác thất bại");
            }
        } catch (err) {
            toast.error("Thao tác thất bại");
        }
    };

    return (
        <div>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2>Quản lý đánh giá (Reviews)</h2>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <Input
                        placeholder="Tìm kiếm theo user, tour, nội dung..."
                        value={search}
                        onChange={(e) => {
                            const v = e.target.value;
                            setSearch(v);
                            fetchReviews(1, pagination.pageSize, v);
                        }}
                        allowClear
                        style={{ width: 260 }}
                    />
                    <Switch
                        checkedChildren={<AppstoreOutlined />}
                        unCheckedChildren={<UnorderedListOutlined />}
                        checked={viewMode === "card"}
                        onChange={(checked) => setViewMode(checked ? "card" : "list")}
                        style={{ marginTop: 4 }}
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditing(null); setOpen(true); }}>
                        Thêm
                    </Button>
                </div>
            </div>

            <Spin spinning={loading}>
                {viewMode === "list" ? (
                    <ReviewList
                        data={reviews}
                        pagination={pagination}
                        onPageChange={fetchReviews}
                        onView={(r) => setViewing(r)}
                        onEdit={(r) => { setEditing(r); setOpen(true); }}
                        onDelete={(id) => {
                            // Use Popconfirm or confirm in parent table; here direct call
                            handleDelete(id);
                        }}
                    />
                ) : (
                    <>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                            {reviews.map((r) => (
                                <Card key={r.id} size="small" actions={[
                                    <Tooltip title="Chi tiết" key="view"><EyeOutlined onClick={() => setViewing(r)} /></Tooltip>,
                                    <Tooltip title="Sửa" key="edit"><EditOutlined onClick={() => { setEditing(r); setOpen(true); }} /></Tooltip>,
                                    <Popconfirm
                                        key="delete"
                                        title="Bạn có chắc chắn muốn xóa đánh giá này?"
                                        okText="Xóa"
                                        cancelText="Hủy"
                                        onConfirm={() => handleDelete(r.id)}
                                        okButtonProps={{ danger: true }}
                                    >
                                        <span style={{ color: 'red', cursor: 'pointer' }}>
                                            <DeleteOutlined />
                                        </span>
                                    </Popconfirm>
                                ]}>
                                    <p style={{ margin: 0, fontWeight: 700 }}>{r.user ? `${r.user.lastname} ${r.user.firstname}` : `User ID: ${r.userId}`}</p>
                                    <p style={{ margin: '6px 0' }}><b>Tour:</b> {r.tour ? r.tour.name : `ID: ${r.tourId}`}</p>
                                    <p style={{ margin: '6px 0' }}><b>Rating:</b> <span style={{ fontWeight: 700 }}>{r.rating}</span></p>
                                    <p style={{ margin: '6px 0', color: '#444' }}>{r.comment}</p>
                                    <p style={{ marginTop: 8, color: '#888' }}>{formatDate(r.createdAt)}</p>
                                </Card>
                            ))}
                        </div>

                        <div style={{ textAlign: "center", marginTop: 16 }}>
                            <Pagination
                                current={pagination.current}
                                pageSize={pagination.pageSize}
                                total={pagination.total}
                                onChange={(page) => fetchReviews(page, pagination.pageSize)}
                            />
                        </div>
                    </>
                )}
            </Spin>

            {/* Modal add/edit */}
            <Modal open={open} onCancel={() => setOpen(false)} footer={null} destroyOnClose title={editing ? "Cập nhật đánh giá" : "Thêm đánh giá"}>
                <ReviewForm initialValues={editing} onSubmit={handleSubmit} onCancel={() => setOpen(false)} />
            </Modal>

            {/* Modal view */}
            <Modal open={!!viewing} onCancel={() => setViewing(null)} footer={null} centered title="Chi tiết đánh giá">
                {viewing && (
                    <Descriptions bordered column={1} size="middle">
                        <Descriptions.Item label="ID">{viewing.id}</Descriptions.Item>
                        <Descriptions.Item label="Người đánh giá">{viewing.user ? `${viewing.user.lastname} ${viewing.user.firstname}` : viewing.userId}</Descriptions.Item>
                        <Descriptions.Item label="Tour">{viewing.tour ? viewing.tour.name : viewing.tourId}</Descriptions.Item>
                        <Descriptions.Item label="Rating">{viewing.rating}</Descriptions.Item>
                        <Descriptions.Item label="Bình luận">{viewing.comment}</Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo">{formatDate(viewing.createdAt)}</Descriptions.Item>
                        <Descriptions.Item label="Ngày cập nhật">{formatDate(viewing.updatedAt)}</Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </div>
    );
};

export default ReviewPage;
