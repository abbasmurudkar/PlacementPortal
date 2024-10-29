import React, { useEffect, useState } from "react";
import {
  Button, Checkbox, DatePicker, Form, Input, Modal, TagPicker, Uploader, useToaster, Notification, Grid, Row, Col, SelectPicker
} from "rsuite";

const ModalForm = (props) => {
  const [companyName, setCompanyName] = useState("");
  const [offerType, setOfferType] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [description, setDescription] = useState("");
  const [ctc, setCTC] = useState("");
  const [branches, setBranches] = useState([]);
  const [cgpa, setCGPA] = useState("");
  const [tenth, setTenth] = useState("");
  const [twelfth, setTwelfth] = useState("");
  const [eligibility, setEligibility] = useState({ noActiveKT: false, noBacklog: false });
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [url, setUrl] = useState(null);
  const toaster = useToaster();

  const offerTypes = [
    { label: 'Placement', value: 'Placement' },
    { label: 'Placement + PPO', value: 'Placement + PPO' },
  ];

  const branchesData = [
    "Information Technology",
    "Cyber Security",
    "Artificial Intelligence",
  ].map((item) => ({
    label: item,
    value: item,
  }));

  useEffect(() => {
    if (url) {
      fetch('/createCompany', {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + sessionStorage.getItem("jwt")
        },
        body: JSON.stringify({
          CompanyName: companyName,
          OfferType: offerType,
          StartDate: startDate ? startDate.toISOString().split('T')[0] : null,
          EndDate: endDate ? endDate.toISOString().split('T')[0] : null,
          Description: description,
          CTC: ctc,
          Branch: branches.join(', '),
          CGPA: cgpa,
          Tenth: tenth,
          Twelfth: twelfth,
          KT: eligibility.noActiveKT ? "No" : "Yes",
          Backlog: eligibility.noBacklog ? "No" : "Yes",
          Document: url,
        })
      }).then(res => res.json()).then((data) => {
        if (data.error) {
          toaster.push(
            <Notification type="error" header="Error">
              {data.error}
            </Notification>,
            { placement: "topCenter", duration: 3000 }
          );
        } else {
          toaster.push(
            <Notification type="success" header="Success">
              "Posted Successfully"
            </Notification>,
            { placement: "topCenter", duration: 3000 }
          );
          resetForm();
          props.handleClose();
        }
      });
    }
  }, [url]);

  const handleSubmit = async () => {
    if (!companyName || !offerType || !startDate || !endDate || !description || !ctc || !branches.length || !cgpa || !tenth || !twelfth || !eligibility.noActiveKT || !eligibility.noBacklog || !uploadedFileName) {
      toaster.push(
        <Notification type="error" header="Error">
          Please fill in all the required fields.
        </Notification>,
        { placement: "topCenter", duration: 3000 }
      );
      return;
    } else if (new Date(startDate) >= new Date(endDate)) {
      toaster.push(
        <Notification type="error" header="Error">Start Date must be before End Date.</Notification>,
        { placement: 'topCenter' }
      );
      return;
    } else {
      const data = new FormData();
      data.append("file", uploadedFileName);
      data.append("upload_preset", "sum6o5c8");
      data.append("folder", "CompanyDocuments");
      fetch("https://api.cloudinary.com/v1_1/daonxdqxe/raw/upload", {
        method: "post",
        body: data
      }).then(res => res.json()).then(data => {
        setUrl(data.url);
      }).catch(err => {
        console.log(err);
      });
    }
  };

  const handleFileChange = (value) => {
    if (value && value.length > 0) {
      setUploadedFileName(value[0].blobFile);
    }
  };

  const handleCheckboxChange = (value) => {
    setEligibility((prev) => ({
      ...prev,
      [value]: !prev[value],
    }));
  };

  const resetForm = () => {
    setCompanyName("");
    setOfferType("");
    setStartDate(null);
    setEndDate(null);
    setDescription("");
    setCTC("");
    setBranches([]);
    setCGPA("");
    setTenth("");
    setTwelfth("");
    setEligibility({ noActiveKT: false, noBacklog: false });
    setUploadedFileName("");
    setUrl(null);
  };

  return (
    <Modal size="lg" open={props.open} onClose={props.handleClose} style={{ overflow: "hidden" }}>
      <Modal.Header>
        <Modal.Title>Create New Drive</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form fluid>
          <Grid fluid>
            <Row gutter={15} style={{ marginBottom: 16 }}>
              <Col xs={24} md={12}>
                <Form.Group controlId="Companyname">
                  <Form.ControlLabel>Company Name</Form.ControlLabel>
                  <Form.Control name="Companyname" value={companyName} onChange={(value) => setCompanyName(value)} />
                  <Form.HelpText>Company Name is Required</Form.HelpText>
                </Form.Group>
              </Col>
              <Col xs={24} md={12}>
                <Form.Group controlId="OfferType">
                  <Form.ControlLabel>Offer Type</Form.ControlLabel>
                  <SelectPicker
                    data={offerTypes}
                    value={offerType}
                    onChange={(value) => setOfferType(value)}
                    placeholder="Select Offer Type"
                    searchable={false}
                    block
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col xs={24} md={12}>
                <Form.Group controlId="StartDate">
                  <Form.ControlLabel>Start Date</Form.ControlLabel>
                  <Form.Control name="StartDate" accepter={DatePicker} value={startDate} onChange={(value) => setStartDate(value)} />
                </Form.Group>
              </Col>
              <Col xs={24} md={12}>
                <Form.Group controlId="EndDate">
                  <Form.ControlLabel>End Date</Form.ControlLabel>
                  <Form.Control name="EndDate" accepter={DatePicker} value={endDate} onChange={(value) => setEndDate(value)} />
                </Form.Group>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col xs={24}>
                <Form.Group controlId="Description">
                  <Form.ControlLabel>Description</Form.ControlLabel>
                  <Input as="textarea" rows={5} name="Description" value={description} onChange={(value) => setDescription(value)} />
                </Form.Group>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col xs={24} md={12}>
                <Form.Group controlId="CTC">
                  <Form.ControlLabel>CTC</Form.ControlLabel>
                  <Form.Control name="CTC" type="number" value={ctc} onChange={(value) => setCTC(value)} />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group controlId="Eligibility" style={{ borderTop: "0.1px solid grey", paddingTop: "20px", marginBottom: 16 }}>
              <Form.ControlLabel style={{ fontWeight: "bolder" }}>Eligibility Criteria:</Form.ControlLabel>
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col xs={24} md={12}>
                  <Form.Group controlId="Branches">
                    <Form.ControlLabel>Branches</Form.ControlLabel>
                    <Form.Control name="Branches" accepter={TagPicker} data={branchesData} block value={branches} onChange={(value) => setBranches(value)} />
                  </Form.Group>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Group controlId="CGPA">
                    <Form.ControlLabel>CGPA (Out Of 4)</Form.ControlLabel>
                    <Form.Control name="CGPA" type="number" value={cgpa} onChange={(value) => setCGPA(value)} />
                  </Form.Group>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col xs={24} md={12}>
                  <Form.Group controlId="10th">
                    <Form.ControlLabel>10th Percentage</Form.ControlLabel>
                    <Form.Control name="10th" type="number" value={tenth} onChange={(value) => setTenth(value)} />
                  </Form.Group>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Group controlId="12th">
                    <Form.ControlLabel>12th or Diploma Percentage</Form.ControlLabel>
                    <Form.Control name="12th" type="number" value={twelfth} onChange={(value) => setTwelfth(value)} />
                  </Form.Group>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col xs={24}>
                  <Form.Group>
                    <Checkbox value="noActiveKT" checked={eligibility.noActiveKT} onChange={() => handleCheckboxChange("noActiveKT")}>No Active KT</Checkbox>
                    <Checkbox value="noBacklog" checked={eligibility.noBacklog} onChange={() => handleCheckboxChange("noBacklog")}>No Previous/Cleared Backlogs</Checkbox>
                  </Form.Group>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col xs={24}>
                  <Form.Group>
                    <Form.ControlLabel>Upload Documents</Form.ControlLabel>
                    <Uploader 
                      name="Uploader" 
                      action="#" 
                      onChange={handleFileChange}
                      autoUpload={false}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form.Group>
          </Grid>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button appearance="primary" color="red" onClick={handleSubmit}>Submit</Button>
        <Button onClick={props.handleClose} appearance="subtle">Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalForm;