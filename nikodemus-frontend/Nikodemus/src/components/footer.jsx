import React, { useState, useEffect } from "react";
import { Container, Row, Col, Stack, Image, Nav, NavLink } from "react-bootstrap";


const footer = () => {

    return (
        <>
            <footer>
                <Container fluid>
                   <Col>
                    <Row>
                        Author:
                    </Row>
                    <Row>
                    &copy;Benjamin JEHL 2024
                    </Row>
                    </Col>
                </Container>
            </footer>
        </>
    )
};

export default footer;