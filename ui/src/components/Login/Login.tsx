import * as React from "react";

import {Button, Col, Input, Row} from "antd";

import "./Login.less";

export default () => (
    <React.Fragment>
        <Row className="login-row">
            <Col span={12} offset={6}>
                <Input size="large" placeholder="Login" />
                <Input size="large" type="password" placeholder="Password" />
                <Button className="login-button" type="primary">Login</Button>
            </Col>
        </Row>
    </React.Fragment>
);
