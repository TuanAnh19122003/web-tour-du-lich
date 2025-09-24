/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, Dropdown, Avatar } from "antd";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
    UserOutlined,
    DashboardOutlined,
    LogoutOutlined,
    HistoryOutlined,
} from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import logo from "../assets/logo.png";

const { Header, Content, Footer } = Layout;

const UserLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);

    const loadUser = () => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) setUser(storedUser);
    };

    useEffect(() => {
        loadUser();
        const handleUserUpdated = () => loadUser();
        window.addEventListener("userUpdated", handleUserUpdated);
        window.addEventListener("storage", (e) => {
            if (e.key === "user") loadUser();
        });
        return () => {
            window.removeEventListener("userUpdated", handleUserUpdated);
        };
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000;
                if (decoded.exp < currentTime) {
                    handleLogout();
                } else {
                    const remainingTime = (decoded.exp - currentTime) * 1000;
                    setTimeout(() => handleLogout(), remainingTime);
                }
            } catch {
                handleLogout();
            }
        }
    }, []);

    const handleLogin = () => navigate("/auth/login");

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        navigate("/auth/login");
    };

    const menuItems = [
        { key: "profile", icon: <UserOutlined />, label: <Link to="/profile">Thông tin cá nhân</Link> },
        { key: "booking-history", icon: <HistoryOutlined />, label: <Link to="/booking-history">Lịch sử đặt tour</Link> },
        { key: "logout", icon: <LogoutOutlined />, label: "Đăng xuất", onClick: handleLogout },
    ];

    if (user && user.role?.code?.toLowerCase() === "admin") {
        menuItems.unshift({
            key: "dashboard",
            icon: <DashboardOutlined />,
            label: <Link to="/admin">Dashboard</Link>,
        });
    }

    const userMenu = { items: menuItems };
    const avatarUrl = user?.image ? `http://localhost:5000/${user.image}` : null;

    return (
        <Layout style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Header du lịch */}
            <Header
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 40px",
                    background: "linear-gradient(90deg,#0099f7,#f11712)", // xanh biển -> cam
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
            >
                {/* Logo */}
                <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <img
                        src={logo}
                        alt="Logo"
                        style={{
                            width: 52,
                            height: 52,
                            objectFit: "cover",
                            borderRadius: "50%",
                            border: "2px solid #fff",
                        }}
                    />
                    <span
                        style={{
                            color: "#fff",
                            fontSize: 22,
                            fontWeight: 700,
                            letterSpacing: 1,
                        }}
                    >
                        Tour Việt Nam
                    </span>
                </Link>

                {/* User avatar / login */}
                <div>
                    {user ? (
                        <Dropdown menu={userMenu} placement="bottomRight">
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    cursor: "pointer",
                                    padding: "4px 8px",
                                    borderRadius: 8,
                                    color: "#fff",
                                }}
                            >
                                <Avatar
                                    size={36}
                                    src={avatarUrl}
                                    icon={!avatarUrl && <UserOutlined />}
                                    alt="avatar"
                                    style={{
                                        backgroundColor: !avatarUrl ? "#ff5722" : "transparent",
                                    }}
                                />
                                <span style={{ fontWeight: 500 }}>
                                    {user.lastname} {user.firstname}
                                </span>
                            </div>
                        </Dropdown>
                    ) : (
                        <Button type="primary" shape="round" icon={<UserOutlined />} onClick={handleLogin}>
                            Đăng nhập
                        </Button>
                    )}
                </div>
            </Header>

            {/* Menu chính */}
            <div
                style={{
                    background: "#fff",
                    margin: "12px auto",
                    borderRadius: 12,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    padding: "0 24px",
                    width: "90%",
                }}
            >
                <Menu
                    mode="horizontal"
                    selectedKeys={[location.pathname]}
                    style={{
                        justifyContent: "center",
                        background: "transparent",
                        borderBottom: "none",
                        fontSize: 16,
                        fontWeight: 500,
                    }}
                    items={[
                        { key: "/", label: <Link to="/">Trang chủ</Link> },
                        { key: "/destinations", label: <Link to="/destinations">Điểm đến</Link> },
                        { key: "/about", label: <Link to="/about">Giới thiệu</Link> },
                        { key: "/contact", label: <Link to="/contact">Liên hệ</Link> },
                    ]}
                />
            </div>

            {/* Nội dung */}
            <Content style={{ padding: "0 40px", marginTop: 12, flex: 1, background: "#f5f6fa" }}>
                <div
                    style={{
                        padding: 24,
                        minHeight: 280,
                        background: "#fff",
                        borderRadius: 12,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                >
                    <Outlet />
                </div>
            </Content>

            {/* Footer */}
            <Footer style={{ textAlign: "center", background: "#fff", padding: "20px 0" }}>
                <div>©{new Date().getFullYear()} Tour Việt Nam. All rights reserved.</div>
                <div>Hotline: 0123 456 789 | Email: support@tourvn.com</div>
            </Footer>
        </Layout>
    );
};

export default UserLayout;
