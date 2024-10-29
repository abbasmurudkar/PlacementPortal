import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Modal, Button, Form, Row, Col, Grid, Input } from "rsuite";
import PageIcon from '@rsuite/icons/Page';

const EditCompanyModal = (props) => {
  const { selectedCompany } = props;
  const [company, setCompany] = useState({
    CompanyName: "",
    OfferType: "",
    StartDate: "",
    EndDate: "",
    Description: "",
    CTC: "",
    Branch: "",
    CGPA: "",
    Tenth: "",
    Twelfth: "",
    KT: "",
    Backlog: "",
    Document: "",
  });

  const handleChange = (value, field) => {
    setCompany({
      ...company,
      [field]: value,
    });
  };

  const handleSave = () => {
    fetch(`/company/${selectedCompany._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
      body: JSON.stringify(company), //here the updation of the table has been done
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        props.onSave(result);
        props.onClose();
      })
      .catch((err) => {
        console.error(err);
      });
  };
  useEffect(() => {
    if (selectedCompany) {
      setCompany(selectedCompany);
    }
  }, [selectedCompany]);
  return (
    <Modal size="lg" open={props.open} onClose={props.onClose}>
      <Modal.Header>
        <Modal.Title>Edit Company</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form fluid>
          <Grid fluid>
            <Row gutter={15} style={{ marginBottom: 16 }}>
              <Col xs={24} md={12}>
                <Form.Group>
                  <Form.ControlLabel>Company Name</Form.ControlLabel>
                  <Form.Control
                    name="CompanyName"
                    value={company.CompanyName}
                    onChange={(value) => handleChange(value, "CompanyName")}
                  />
                </Form.Group>
              </Col>
              <Col xs={24} md={12}>
                <Form.Group>
                  <Form.ControlLabel>Offer Type</Form.ControlLabel>
                  <Form.Control
                    name="OfferType"
                    value={company.OfferType}
                    onChange={(value) => handleChange(value, "OfferType")}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col xs={24} md={12}>
                <Form.Group>
                  <Form.ControlLabel>Start Date</Form.ControlLabel>
                  <Form.Control
                    name="StartDate"
                    type="date"
                    value={company.StartDate.split("T")[0]}
                    onChange={(value) => handleChange(value, "StartDate")}
                  />
                </Form.Group>
              </Col>
              <Col xs={24} md={12}>
                <Form.Group>
                  <Form.ControlLabel>End Date</Form.ControlLabel>
                  <Form.Control
                    name="EndDate"
                    type="date"
                    value={company.EndDate.split("T")[0]}
                    onChange={(value) => handleChange(value, "EndDate")}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col xs={24}>
              <Form.Group controlId="Description">
                <Form.ControlLabel>Description</Form.ControlLabel>
                <Input as="textarea" rows={8} name="Description" value={company.Description} onChange={(value) => handleChange(value,"Description")} />
              </Form.Group>
            </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col xs={24} md={12}>
                <Form.Group>
                  <Form.ControlLabel>CTC</Form.ControlLabel>
                  <Form.Control
                    name="CTC"
                    value={company.CTC}
                    onChange={(value) => handleChange(value, "CTC")}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group
              controlId="Eligibility"
              style={{
                borderTop: "0.1px solid grey",
                paddingTop: "20px",
                marginBottom: 16,
              }}
            >
              <Form.ControlLabel style={{ fontWeight: "bolder" }}>
                Eligibility Criteria:
              </Form.ControlLabel>
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col xs={24} md={12}>
                  <Form.Group>
                    <Form.ControlLabel>Branch</Form.ControlLabel>
                    <Form.Control
                      name="Branch"
                      value={company.Branch}
                      onChange={(value) => handleChange(value, "Branch")}
                    />
                  </Form.Group>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Group>
                    <Form.ControlLabel>CGPA Requirement</Form.ControlLabel>
                    <Form.Control
                      name="CGPA"
                      value={company.CGPA}
                      onChange={(value) => handleChange(value, "CGPA")}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col xs={24} md={12}>
                  <Form.Group>
                    <Form.ControlLabel>10th Grade</Form.ControlLabel>
                    <Form.Control
                      name="Tenth"
                      value={company.Tenth}
                      onChange={(value) => handleChange(value, "Tenth")}
                    />
                  </Form.Group>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Group>
                    <Form.ControlLabel>12th Grade / Diploma</Form.ControlLabel>
                    <Form.Control
                      name="Twelfth"
                      value={company.Twelfth}
                      onChange={(value) => handleChange(value, "Twelfth")}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col xs={24} md={12}>
                  <Form.Group>
                    <Form.ControlLabel>KT</Form.ControlLabel>
                    <Form.Control
                      name="KT"
                      value={company.KT}
                      onChange={(value) => handleChange(value, "KT")}
                    />
                  </Form.Group>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Group>
                    <Form.ControlLabel>Backlog</Form.ControlLabel>
                    <Form.Control
                      name="Backlog"
                      value={company.Backlog}
                      onChange={(value) => handleChange(value, "Backlog")}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col xs={24}>
                  <Form.Group>
                    <Form.ControlLabel
                      style={{ fontSize: 16, fontWeight: 600, color: "#666" }}
                    >
                      Documents
                    </Form.ControlLabel>
                    <Link
                      style={{ fontSize: 16, color: "red" }}
                      to={company.Document}
                      target="_blank"
                    >
                      <PageIcon /> View Document
                    </Link>
                  </Form.Group>
                </Col>
              </Row>
            </Form.Group>
          </Grid>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button appearance="primary" color="red" onClick={handleSave}>
          save
        </Button>
        <Button onClick={props.onClose} appearance="subtle">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditCompanyModal;
