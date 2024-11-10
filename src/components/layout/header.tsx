import {CurrentUser} from "./current-user";
import {Layout, Space} from "antd"

export const Header = () => {

    const headerStyles: React.CSSProperties = {
        backgroundColor: "#fff",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "0px 24px",
        height: "64px",
        position: "sticky",
        top: 0,
        zIndex: 999,
    };

    return (
        <Layout.Header style={headerStyles}>
            <Space align="center" size="middle">
                <CurrentUser />
            </Space>
        </Layout.Header>
    );
}

//54;44