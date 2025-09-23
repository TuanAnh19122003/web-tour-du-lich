/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
    Card, Col, Row, Table, Typography, Tag, message, Button
} from 'antd';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend
} from 'recharts';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const { Title, Text } = Typography;
const COLORS = ['#1890ff', '#52c41a', '#faad14', '#ff4d4f'];

const Dashboard = () => {
    const [tours, setTours] = useState([]);
    const [users, setUsers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [discounts, setDiscounts] = useState([]);

    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tRes, uRes, bRes, dRes] = await Promise.all([
                    axios.get(`${API_URL}/tours`),
                    axios.get(`${API_URL}/users`),
                    axios.get(`${API_URL}/bookings`),
                    axios.get(`${API_URL}/discounts`)
                ]);
                setTours(tRes.data.data);
                setUsers(uRes.data.data);
                setBookings(bRes.data.data);
                setDiscounts(dRes.data.data);
            } catch (err) {
                message.error('Không tải được dữ liệu dashboard');
            }
        };
        fetchData();
    }, []);

    // Tính toán dữ liệu biểu đồ
    const revenueByMonth = {};
    const orderByMonth = {};
    const statusCounts = {};

    bookings.forEach(b => {
        const date = new Date(b.booking_date);
        const monthKey = `${date.getMonth() + 1}/${date.getFullYear()}`;
        revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + Number(b.total_price);
        orderByMonth[monthKey] = (orderByMonth[monthKey] || 0) + 1;
        statusCounts[b.status] = (statusCounts[b.status] || 0) + 1;
    });

    const orderData = Object.keys(orderByMonth).map(key => ({ month: key, orders: orderByMonth[key] }));
    const revenueData = Object.keys(revenueByMonth).map(key => ({ month: key, revenue: revenueByMonth[key] }));
    const statusData = Object.keys(statusCounts).map((status, i) => ({
        name: status.toUpperCase(),
        value: statusCounts[status],
        color: COLORS[i % COLORS.length]
    }));

    // Columns bảng tour
    const columns = [
        { title: 'Tên tour', dataIndex: 'name', key: 'name' },
        { title: 'Địa điểm', dataIndex: 'location', key: 'location' },
        { title: 'Ngày khởi hành', dataIndex: 'start_date', key: 'start_date' },
        { title: 'Ngày kết thúc', dataIndex: 'end_date', key: 'end_date' },
        { title: 'Giá', dataIndex: 'price', key: 'price', render: p => Number(p).toLocaleString() + ' đ' },
        { title: 'Khuyến mãi (%)', dataIndex: ['discount', 'percentage'], key: 'discount', render: p => p ? `${p}%` : 'Không' },
        { title: 'Trạng thái', dataIndex: 'is_active', key: 'is_active', render: v => <Tag color={v ? 'green' : 'red'}>{v ? 'Hoạt động' : 'Ngưng'}</Tag> }
    ];

    // Xuất Excel
    const exportTours = () => {
        if (!tours.length) return;
        const data = tours.map(t => ({
            "Tên tour": t.name,
            "Địa điểm": t.location,
            "Ngày khởi hành": t.start_date,
            "Ngày kết thúc": t.end_date,
            "Giá": Number(t.price),
            "Khuyến mãi (%)": t.discount?.percentage || 0,
            "Trạng thái": t.is_active ? 'Hoạt động' : 'Ngưng'
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Tours");
        saveAs(new Blob([XLSX.write(wb, { bookType: "xlsx", type: "array" })]), "tours.xlsx");
    };

    const exportBookings = () => {
        if (!bookings.length) return;
        const data = bookings.map(b => ({
            "Mã booking": b.id,
            "Khách hàng": b.user ? `${b.user.lastname} ${b.user.firstname}` : 'N/A',
            "Tổng tiền": Number(b.total_price),
            "Trạng thái": b.status,
            "Thanh toán": b.paymentMethod,
            "Ngày đặt": new Date(b.booking_date).toLocaleDateString("vi-VN")
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Bookings");
        saveAs(new Blob([XLSX.write(wb, { bookType: "xlsx", type: "array" })]), "bookings.xlsx");
    };

    return (
        <div style={{ padding: 24 }}>
            {/* Summary cards */}
            <Row gutter={24} style={{ marginBottom: 24 }}>
                <Col xs={24} md={6}>
                    <Card hoverable>
                        <Title level={4}>Tổng số tour</Title>
                        <Text style={{ fontSize: 24 }}>{tours.length}</Text>
                    </Card>
                </Col>
                <Col xs={24} md={6}>
                    <Card hoverable>
                        <Title level={4}>Tổng số người dùng</Title>
                        <Text style={{ fontSize: 24 }}>{users.length}</Text>
                    </Card>
                </Col>
                <Col xs={24} md={6}>
                    <Card hoverable>
                        <Title level={4}>Tổng số booking</Title>
                        <Text style={{ fontSize: 24 }}>{bookings.length}</Text>
                    </Card>
                </Col>
                <Col xs={24} md={6}>
                    <Card hoverable>
                        <Title level={4}>Tổng số khuyến mãi</Title>
                        <Text style={{ fontSize: 24 }}>{discounts.length}</Text>
                    </Card>
                </Col>
            </Row>

            {/* Biểu đồ */}
            <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                <Col xs={24} md={8}>
                    <Card title="Số lượng booking theo tháng" extra={<Button onClick={exportBookings}>Xuất Excel</Button>}>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={orderData}>
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="orders" fill="#52c41a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card title="Doanh thu theo tháng" extra={<Button onClick={exportBookings}>Xuất Excel</Button>}>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={revenueData}>
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip formatter={value => Number(value).toLocaleString() + ' đ'} />
                                <Bar dataKey="revenue" fill="#1890ff" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card title="Tỷ lệ trạng thái booking">
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    innerRadius={50}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={value => [`${value} booking`, '']} />
                                <Legend layout="vertical" verticalAlign="middle" align="right" />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            {/* Bảng tour */}
            <Card title="Danh sách tour" extra={<Button onClick={exportTours}>Xuất Excel</Button>}>
                <Table
                    dataSource={tours}
                    columns={columns}
                    rowKey="id"
                    pagination={{ pageSize: 8 }}
                />
            </Card>
        </div>
    );
};

export default Dashboard;
