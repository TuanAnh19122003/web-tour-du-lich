import React, { useState, useEffect } from "react";
import { Layout, Menu, theme, Breadcrumb, Dropdown, Avatar } from "antd";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
    UserOutlined,
    PieChartOutlined,
    CompassOutlined,
    FileTextOutlined,
    SettingOutlined,
    LogoutOutlined,
    PhoneOutlined,
    TagsOutlined,
} from "@ant-design/icons";
import logo from "../assets/logo.png";

const { Header, Content, Footer, Sider } = Layout;

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { borderRadiusLG },
    } = theme.useToken();

    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

    useEffect(() => {
        try {
            const userData = localStorage.getItem("user");
            if (!userData) {
                navigate("/auth/login", { replace: true });
            } else {
                setUser(JSON.parse(userData));
            }
        } catch (e) {
            console.error("Lỗi khi parse user:", e);
            navigate("/auth/login", { replace: true });
        }
    }, [navigate]);

    const formatBreadcrumb = (segment) =>
        segment
            .replace(/[-_]/g, " ")
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .replace(/\b\w/g, (char) => char.toUpperCase());

    const pathSegments = location.pathname.split("/").filter(Boolean);
    const breadcrumbItems = [{ title: "Admin" }];
    pathSegments.slice(1).forEach((segment) => {
        breadcrumbItems.push({ title: formatBreadcrumb(segment) });
    });

    const items = [
        {
            key: "dashboard",
            icon: <PieChartOutlined />,
            label: <Link to="/admin">Dashboard</Link>,
        },
        {
            key: "sub-user-management",
            icon: <UserOutlined />,
            label: "Người dùng",
            children: [
                { key: "users", label: <Link to="/admin/users">Danh sách</Link> },
                { key: "roles", label: <Link to="/admin/roles">Vai trò</Link> },
            ],
        },
        {
            key: "sub-tour-management",
            icon: <CompassOutlined />,
            label: "Tour du lịch",
            children: [
                { key: "categories", label: <Link to="/admin/categories">Loại tour</Link> },
                { key: "tours", label: <Link to="/admin/tours">Danh sách tour</Link> },
                { key: "discounts", icon: <TagsOutlined />, label: <Link to="/admin/discounts">Khuyến mãi</Link> },
            ],
        },
        {
            key: "booking-management",
            icon: <FileTextOutlined />,
            label: <Link to="/admin/bookings">Đặt tour</Link>,
        },
        {
            key: "contact-management",
            icon: <PhoneOutlined />,
            label: <Link to="/admin/contacts">Liên hệ</Link>,
        },
    ];

    const userMenu = {
        items: [
            { key: "profile", icon: <UserOutlined />, label: "Thông tin cá nhân" },
            { key: "settings", icon: <SettingOutlined />, label: "Cài đặt" },
            {
                key: "user",
                icon: <SettingOutlined />,
                label: "Trang người dùng",
                onClick: () => navigate("/"),
            },
            { type: "divider" },
            {
                key: "logout",
                icon: <LogoutOutlined />,
                danger: true,
                label: "Đăng xuất",
                onClick: () => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    window.location.href = "/auth/login";
                },
            },
        ],
    };

    if (!user)
        return (
            <div
                style={{
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: 18,
                }}
            >
                Đang kiểm tra đăng nhập...
            </div>
        );

    return (
        <Layout style={{ minHeight: "100vh", background: "#f4f6f9" }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                width={220}
                style={{
                    margin: 16,
                    borderRadius: 12,
                    background: "#fff",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        padding: 16,
                    }}
                >
                    <img
                        src={logo}
                        alt="Logo"
                        style={{
                            height: collapsed ? 40 : 80,
                            width: collapsed ? 40 : 80,
                            borderRadius: 8,
                            objectFit: "cover",
                            transition: "all 0.3s ease",
                        }}
                    />
                </div>
                <Menu mode="inline" items={items} />
            </Sider>

            <Layout>
                <Header
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0 20px",
                        background: "linear-gradient(90deg,#0099f7,#2dd4bf)",
                        color: "#fff",
                        borderRadius: "0 0 12px 12px",
                    }}
                >
                    <div style={{ fontWeight: "bold", fontSize: 20 }}>Admin - Quản lý Tour</div>

                    <Dropdown menu={userMenu} trigger={["click"]}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                cursor: "pointer",
                                color: "#fff",
                            }}
                        >
                            <Avatar src={`http://localhost:5000/${user.image}`} size={36} />
                            <span>
                                {user.lastname} {user.firstname}
                            </span>
                        </div>
                    </Dropdown>
                </Header>

                <div style={{ padding: "12px 24px", background: "#f9fafb" }}>
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                <Content style={{ margin: "0 24px 24px" }}>
                    <div
                        style={{
                            padding: 20,
                            minHeight: 360,
                            background: "#fff",
                            borderRadius: borderRadiusLG,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>

                <Footer style={{ textAlign: "center", background: "#f4f6f9" }}>
                    ©{new Date().getFullYear()} Tour Việt Nam. All rights reserved.
                </Footer>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
