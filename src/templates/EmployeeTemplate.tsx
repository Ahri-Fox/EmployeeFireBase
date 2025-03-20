import React, { useEffect } from "react";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Menu, theme, Dropdown, Avatar, Space } from "antd";
import { NavLink, Route, RouteProps, useHistory, useLocation } from "react-router-dom";
import logo from "../assets/logo.png"
import { RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { logout, setUser } from "../redux/slice/userSlice";



type EmployeeTemplateProps = RouteProps & {
    WrappedComponent: React.ComponentType<any>;
};



const EmployeeTemplate: React.FC<EmployeeTemplateProps> = ({ WrappedComponent, ...rest }) => {
    const { token } = theme.useToken();
    const location = useLocation();
    const user = useSelector((state: RootState) => state.user.user);
    const history = useHistory();
    const dispatch = useDispatch();
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            dispatch(setUser(JSON.parse(storedUser).payload));
        }
    }, [dispatch]);


    useEffect(() => {
        if (!user) {
            history.push("/login");
        }
    }, [user, history]);


    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem("user");
        setTimeout(() => {
            history.push("/login");
        }, 100);
    };


    const menuItems = [
        {
            key: "sub1",
            icon: <UserOutlined />,
            label: "Users",
            children: [
                {
                    key: "10",
                    icon: <UserOutlined />,
                    label: <NavLink to="/listemployee">Employees</NavLink>,
                },
                {
                    key: "11",
                    icon: <PlusOutlined />,
                    label: <NavLink to="/listemployee/addemployee">Add employee</NavLink>,
                },

            ],
        },
    ];

    const userMenu = (
        <Menu>
            <Menu.Item key="1">
                <NavLink to={`/profile/${user?.id}`}>Profile</NavLink>
            </Menu.Item>
            <Menu.Item key="2">
                <NavLink to="/settings">Settings</NavLink>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="3">
                <NavLink onClick={handleLogout} to="/login">Logout</NavLink>
            </Menu.Item>
        </Menu>
    );


    return (
        <Route
            {...rest}
            render={(props) => (
                <Layout style={{ height: "100vh" }}>

                    <Layout.Sider breakpoint="lg" collapsedWidth="0">
                        <div className="logo" style={{ width: '50%', margin: 'auto' }}>
                            <img src={logo} alt="logo" />
                        </div>
                        <Menu className="mt-5" theme="dark" selectedKeys={[location.pathname]} defaultSelectedKeys={["10"]} defaultOpenKeys={["sub1"]}
                            mode="inline" items={menuItems}>
                        </Menu>
                    </Layout.Sider>

                    <Layout>
                        <Layout.Header
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                paddingRight: "20px",
                                background: token.colorBgContainer,
                            }}
                        >
                            <Dropdown overlay={userMenu} trigger={['click']}>
                                <Space>
                                    <Avatar src={user?.avatarUrl} size="large" icon={!user?.avatarUrl && <UserOutlined />} style={{ cursor: "pointer" }} />

                                </Space>
                            </Dropdown>
                        </Layout.Header>
                        <Layout.Content style={{ margin: "24px 16px 0" }}>
                            <div
                                style={{
                                    padding: 24,
                                    minHeight: 360,
                                    background: token.colorBgContainer,
                                    borderRadius: token.borderRadiusLG,
                                }}>
                                <WrappedComponent {...props} />
                            </div>
                        </Layout.Content>
                    </Layout>
                </Layout >
            )}
        />
    );
};

export default EmployeeTemplate;
