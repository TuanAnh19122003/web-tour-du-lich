import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

const AuthLayout = () => {
    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Content
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)",
                    padding: "40px",
                    position: "relative",
                }}
            >
                {/* Hiệu ứng background hình du lịch */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        opacity: 0.2,
                    }}
                />

                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        maxWidth: "420px",
                        backgroundColor: "#fff",
                        padding: "40px 32px",
                        borderRadius: "16px",
                        boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
                    }}
                >
                    <Outlet />
                </div>
            </Content>
        </Layout>
    );
};

export default AuthLayout;
