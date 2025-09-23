/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
    Button,
    Modal,
    Spin,
    Input,
    Tag,
    Card,
    Tooltip,
    Popconfirm,
    Pagination,
    Descriptions,
    Switch,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    AppstoreOutlined,
    UnorderedListOutlined,
} from "@ant-design/icons";
import axios from "axios";
import toast from "react-hot-toast";
import BookingList from "./BookingList";
import BookingForm from "./BookingForm";
import { formatDate } from "../../../utils/helpers";

const BookingPage = () => {
    const [bookings, setBookings] = useState([]);
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 6,
        total: 0,
    });
    const [loading, setLoading] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [viewing, setViewing] = useState(null);
    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState("list");

    const API_URL = process.env.REACT_APP_API_URL;

    const fetchBookings = async (page = 1, pageSize = 6, keyword = search) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/bookings`, {
                params: { page, pageSize, search: keyword || null },
            });
            const { data, total } = res.data;
            setBookings(data);
            setPagination({ current: page, pageSize, total });
        } catch (err) {
            toast.error("Lỗi tải booking");
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${API_URL}/users`);
            setUsers(res.data.data);
        } catch {
            toast.error("Lỗi tải người dùng");
        }
    };

    useEffect(() => {
        fetchBookings();
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`${API_URL}/bookings/${id}`);
            toast.success(res.data.message || "Xóa thành công");
            fetchBookings(pagination.current, pagination.pageSize);
        } catch {
            toast.error("Xóa thất bại");
        }
    };

    const handleSubmit = async (booking) => {
        try {
            let res;
            if (editing) {
                res = await axios.put(`${API_URL}/bookings/${editing.id}`, booking);
            } else {
                res = await axios.post(`${API_URL}/bookings`, booking);
            }

            if (res.data.success) {
                toast.success(res.data.message || "Thành công");
                fetchBookings(pagination.current, pagination.pageSize);
                setOpenForm(false);
            } else {
                toast.error(res.data.message || "Thao tác thất bại");
            }
        } catch {
            toast.error("Thao tác thất bại");
        }
    };

    return (
        <div>
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 16,
                }}
            >
                <h2>Quản lý Booking</h2>
                <div style={{ display: "flex", gap: 8 }}>
                    <Input
                        placeholder="Tìm kiếm booking..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            fetchBookings(1, pagination.pageSize, e.target.value);
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
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setOpenForm(true)}
                    >
                        Thêm
                    </Button>
                </div>
            </div>

            {/* Nội dung */}
            <Spin spinning={loading}>
                {viewMode === "list" ? (
                    <BookingList
                        data={bookings}
                        pagination={pagination}
                        onPageChange={fetchBookings}
                        onView={setViewing}
                        onEdit={(b) => {
                            setEditing(b);
                            setOpenForm(true);
                        }}
                        onDelete={handleDelete}
                    />
                ) : (
                    <>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(3, 1fr)",
                                gap: 16,
                            }}
                        >
                            {bookings.map((b) => (
                                <Card
                                    key={b.id}
                                    size="small"
                                    actions={[
                                        <Tooltip title="Chi tiết" key="view">
                                            <EyeOutlined onClick={() => setViewing(b)} />
                                        </Tooltip>,
                                        <Tooltip title="Sửa" key="edit">
                                            <EditOutlined
                                                onClick={() => {
                                                    setEditing(b);
                                                    setOpenForm(true);
                                                }}
                                            />
                                        </Tooltip>,
                                        <Popconfirm
                                            title="Xóa booking này?"
                                            onConfirm={() => handleDelete(b.id)}
                                            key="delete"
                                        >
                                            <DeleteOutlined style={{ color: "red" }} />
                                        </Popconfirm>,
                                    ]}
                                >
                                    <p>
                                        <b>Khách:</b>{" "}
                                        {b.user
                                            ? `${b.user.lastname} ${b.user.firstname}`
                                            : "N/A"}
                                    </p>
                                    <p>
                                        <b>Tổng:</b>{" "}
                                        {b.total_price?.toLocaleString("vi-VN") + " ₫"}
                                    </p>
                                    <p>
                                        <b>Trạng thái:</b>{" "}
                                        <Tag color="blue">{b.status}</Tag>
                                    </p>
                                </Card>
                            ))}
                        </div>
                        <Pagination
                            style={{ marginTop: 16, textAlign: "center" }}
                            current={pagination.current}
                            pageSize={pagination.pageSize}
                            total={pagination.total}
                            onChange={(page) => fetchBookings(page, pagination.pageSize)}
                        />
                    </>
                )}
            </Spin>

            {/* Modal form */}
            <Modal
                open={openForm}
                onCancel={() => setOpenForm(false)}
                footer={null}
                destroyOnClose
                title={editing ? "Cập nhật Booking" : "Thêm Booking"}
            >
                <BookingForm
                    users={users}
                    initialValues={editing}
                    onSubmit={handleSubmit}
                    onCancel={() => setOpenForm(false)}
                />
            </Modal>

            {/* Modal chi tiết */}
            <Modal
                open={!!viewing}
                onCancel={() => setViewing(null)}
                footer={null}
                centered
                title="Chi tiết Booking"
                width={800} // mở rộng để vừa bảng
            >
                {viewing && (
                    <>
                        <Descriptions bordered column={1} size="middle" style={{ marginBottom: 16 }}>
                            <Descriptions.Item label="Mã">{viewing.id}</Descriptions.Item>
                            <Descriptions.Item label="Khách hàng">
                                {viewing.user
                                    ? `${viewing.user.lastname} ${viewing.user.firstname}`
                                    : "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tổng tiền">
                                {Number(viewing.total_price).toLocaleString("vi-VN") + " ₫"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                <Tag>{viewing.status}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Thanh toán">
                                <Tag>{viewing.paymentMethod}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Ghi chú">
                                {viewing.note || "Không có"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày đặt">
                                {formatDate(viewing.booking_date)}
                            </Descriptions.Item>
                        </Descriptions>

                        {/* Danh sách tour trong booking */}
                        <h4>Danh sách tour</h4>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ background: "#fafafa" }}>
                                    <th style={{ border: "1px solid #ddd", padding: 8 }}>Mã tour</th>
                                    <th style={{ border: "1px solid #ddd", padding: 8 }}>Tên tour</th>
                                    <th style={{ border: "1px solid #ddd", padding: 8 }}>Số lượng</th>
                                    <th style={{ border: "1px solid #ddd", padding: 8 }}>Giá</th>
                                    <th style={{ border: "1px solid #ddd", padding: 8 }}>Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {viewing.items?.map((item) => (
                                    <tr key={item.id}>
                                        <td style={{ border: "1px solid #ddd", padding: 8 }}>
                                            {item.tour?.code}
                                        </td>
                                        <td style={{ border: "1px solid #ddd", padding: 8 }}>
                                            {item.tour?.name}
                                        </td>
                                        <td style={{ border: "1px solid #ddd", padding: 8 }}>
                                            {item.quantity}
                                        </td>
                                        <td style={{ border: "1px solid #ddd", padding: 8 }}>
                                            {Number(item.price).toLocaleString("vi-VN")} ₫
                                        </td>
                                        <td style={{ border: "1px solid #ddd", padding: 8 }}>
                                            {(item.quantity * Number(item.price)).toLocaleString("vi-VN")} ₫
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </Modal>

        </div>
    );
};

export default BookingPage;
