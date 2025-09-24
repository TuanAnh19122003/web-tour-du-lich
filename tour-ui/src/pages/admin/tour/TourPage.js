/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Button, Modal, Spin, Descriptions, Input, Switch, Card, Tooltip, Popconfirm, Pagination, Tag } from "antd";
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, UnorderedListOutlined, AppstoreOutlined } from "@ant-design/icons";
import axios from "axios";
import toast from "react-hot-toast";
import { formatDate, formatCurrency } from "../../../utils/helpers";
import TourForm from "./TourForm";
import TourList from "./TourList";

const TourPage = () => {
    const [tours, setTours] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [viewing, setViewing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 6, total: 0 });
    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState("list");

    const API_URL = process.env.REACT_APP_API_URL;

    const fetchTours = async (page = 1, pageSize = 6, keyword = search) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/tours`, { params: { page, pageSize, search: keyword || null } });
            const { data, total } = res.data;
            setTours(data);
            setPagination({ current: page, pageSize, total });
        } catch (err) {
            toast.error("Lỗi tải danh sách tour");
        } finally {
            setLoading(false);
        }
    };

    const fetchDiscounts = async () => {
        try {
            const res = await axios.get(`${API_URL}/discounts`);
            setDiscounts(res.data.data);
        } catch {
            toast.error("Lỗi tải giảm giá");
        }
    };

    useEffect(() => {
        fetchTours();
        fetchDiscounts();
    }, []);

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`${API_URL}/tours/${id}`);
            toast.success(res.data.message);
            const isLast = tours.length === 1 && pagination.current > 1;
            fetchTours(isLast ? pagination.current - 1 : pagination.current, pagination.pageSize);
        } catch {
            toast.error("Xóa thất bại");
        }
    };

    const handleSubmit = async (tour) => {
        try {
            const formData = new FormData();
            formData.append("code", tour.code);
            formData.append("name", tour.name);
            formData.append("description", tour.description || "");
            formData.append("price", tour.price);
            formData.append("location", tour.location);
            formData.append("max_people", tour.max_people);
            formData.append("available_people", tour.available_people);
            formData.append("is_active", tour.is_active ? 1 : 0);
            formData.append("is_featured", tour.is_featured ? 1 : 0);
            if (tour.discountId) formData.append("discountId", tour.discountId);

            if (tour.start_date) formData.append("start_date", tour.start_date.format("YYYY-MM-DD"));
            if (tour.end_date) formData.append("end_date", tour.end_date.format("YYYY-MM-DD"));

            if (tour.image instanceof File) {
                formData.append("image", tour.image);
            }

            let res;
            if (editing) {
                res = await axios.put(`${API_URL}/tours/${editing.id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                res = await axios.post(`${API_URL}/tours`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            if (res.data.success) {
                toast.success(res.data.message);
                fetchTours(pagination.current, pagination.pageSize);
                setOpen(false);
            } else {
                toast.error(res.data.message || "Thao tác thất bại");
            }
        } catch (err) {
            console.error(err);
            toast.error("Thao tác thất bại");
        }
    };


    return (
        <div>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <h2>Danh sách Tour</h2>
                <div style={{ display: "flex", gap: 8 }}>
                    <Input
                        placeholder="Tìm kiếm tour..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            fetchTours(1, pagination.pageSize, e.target.value);
                        }}
                        allowClear
                        style={{ width: 250, height: 40 }}
                    />
                    <Switch
                        checkedChildren={<AppstoreOutlined />}
                        unCheckedChildren={<UnorderedListOutlined />}
                        checked={viewMode === "card"}
                        onChange={(checked) => setViewMode(checked ? "card" : "list")}
                        style={{
                            marginTop: 10,
                        }}
                    />

                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
                        Thêm
                    </Button>
                </div>
            </div>

            {/* Content */}
            <Spin spinning={loading}>
                {viewMode === "list" ? (
                    <TourList
                        data={tours}
                        discounts={discounts}
                        pagination={pagination}
                        onPageChange={fetchTours}
                        onView={setViewing}
                        onEdit={(t) => { setEditing(t); setOpen(true); }}
                        onDelete={handleDelete}
                    />
                ) : (
                    <>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                            {tours.map((tour) => (
                                <Card
                                    key={tour.id}
                                    size="small"
                                    cover={tour.image ? <img src={`http://localhost:5000/${tour.image}`} alt={tour.name} /> : null}
                                    actions={[
                                        <Tooltip title="Chi tiết" key="view"><EyeOutlined onClick={() => setViewing(tour)} /></Tooltip>,
                                        <Tooltip title="Sửa" key="edit"><EditOutlined onClick={() => { setEditing(tour); setOpen(true); }} /></Tooltip>,
                                        <Popconfirm title="Xóa tour này?" onConfirm={() => handleDelete(tour.id)} key="delete">
                                            <DeleteOutlined style={{ color: "red" }} />
                                        </Popconfirm>,
                                    ]}
                                >
                                    <p style={{ fontWeight: 600 }}>{tour.name}</p>
                                    <p><b>Giá:</b> {formatCurrency(Number(tour.price))}</p>
                                    <p><b>Địa điểm:</b> {tour.location}</p>
                                    <p><b>Trạng thái:</b> {tour.is_active ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Ngừng</Tag>}</p>
                                </Card>
                            ))}
                        </div>
                        <Pagination
                            style={{ marginTop: 16, textAlign: "center" }}
                            current={pagination.current}
                            pageSize={pagination.pageSize}
                            total={pagination.total}
                            onChange={(page) => fetchTours(page, pagination.pageSize)}
                        />
                    </>
                )}
            </Spin>

            {/* Modal thêm/sửa */}
            <Modal open={open} onCancel={() => setOpen(false)} footer={null} destroyOnClose title={editing ? "Cập nhật tour" : "Thêm tour"}>
                <TourForm initialValues={editing} onSubmit={handleSubmit} onCancel={() => setOpen(false)} discounts={discounts} />
            </Modal>

            {/* Modal chi tiết */}
            <Modal
                open={!!viewing}
                onCancel={() => setViewing(null)}
                footer={null}
                centered
                width={800}
                title="Chi tiết tour"
            >
                {viewing && (
                    <>
                        {/* Ảnh tour */}
                        {viewing.image && (
                            <div style={{ textAlign: "center", marginBottom: 20 }}>
                                <img
                                    src={`http://localhost:5000/${viewing.image}`}
                                    alt={viewing.name}
                                    style={{ maxHeight: 300, borderRadius: 8, objectFit: "cover" }}
                                />
                            </div>
                        )}

                        <Descriptions bordered column={2} size="middle">
                            <Descriptions.Item label="Mã tour">{viewing.code}</Descriptions.Item>
                            <Descriptions.Item label="Tên tour">{viewing.name}</Descriptions.Item>
                            <Descriptions.Item label="Slug">{viewing.slug}</Descriptions.Item>
                            <Descriptions.Item label="Địa điểm">{viewing.location}</Descriptions.Item>

                            <Descriptions.Item label="Giá" span={2}>
                                {formatCurrency(Number(viewing.price))}
                                {viewing.discount && (
                                    <span style={{ marginLeft: 8, color: "red" }}>
                                        -{viewing.discount.percentage}%
                                    </span>
                                )}
                            </Descriptions.Item>

                            <Descriptions.Item label="Số lượng tối đa">{viewing.max_people}</Descriptions.Item>
                            <Descriptions.Item label="Còn trống">
                                {viewing.available_people} / {viewing.max_people}
                            </Descriptions.Item>

                            <Descriptions.Item label="Ngày bắt đầu">
                                {formatDate(viewing.start_date)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày kết thúc">
                                {formatDate(viewing.end_date)}
                            </Descriptions.Item>

                            <Descriptions.Item label="Trạng thái">
                                {viewing.is_active ? "Hoạt động" : "Ngừng"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Nổi bật">
                                {viewing.is_featured ? "Có" : "Không"}
                            </Descriptions.Item>

                            <Descriptions.Item label="Mô tả" span={2}>
                                {viewing.description}
                            </Descriptions.Item>

                            {/* Nếu bạn có rating */}
                            {viewing.avgRating && (
                                <Descriptions.Item label="Đánh giá trung bình" span={2}>
                                    ⭐ {viewing.avgRating.toFixed(1)} / 5 ({viewing.reviewCount} đánh giá)
                                </Descriptions.Item>
                            )}
                        </Descriptions>
                    </>
                )}
            </Modal>

        </div>
    );
};

export default TourPage;
