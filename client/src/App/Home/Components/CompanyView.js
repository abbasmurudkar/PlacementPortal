import React from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button, Panel, Form, Row, Col } from 'rsuite';
import PageIcon from '@rsuite/icons/Page';

  const View = (props) => {
    const { selectedCompany } = props;
    return (
      <Modal open={props.openView} onClose={props.handleViewClose} size={"lg"} style={{ borderRadius: 10 }}>
        <Modal.Header style={{ backgroundColor: '#f7f7f7', padding: 20, borderRadius: 10 }}>
          <Modal.Title style={{ fontSize: 24, fontWeight: 600, color: '#333' }}>{selectedCompany?selectedCompany.CompanyName:"Default"}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: 20 }}>
          {selectedCompany ? (
            <div>
              <Panel shaded bordered style={{ borderRadius: 10, marginBottom: 20, boxShadow:"grey 0px 0px 6px 0px" }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: '#333', padding: 10 }}>Company Overview</h2>

                <Form fluid>
                  <Row style={{ marginBottom: 20 }}>
                    <Col xs={12}>
                      <Form.Group>
                        <Form.ControlLabel style={{ fontSize: 16, fontWeight: 600, color: '#666' }}>Start Date</Form.ControlLabel>
                        <p style={{ fontSize: 16, color: '#333' }}>{new Date(selectedCompany.StartDate).toLocaleDateString()}</p>
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Form.Group>
                        <Form.ControlLabel style={{ fontSize: 16, fontWeight: 600, color: '#666' }}>End Date</Form.ControlLabel>
                        <p style={{ fontSize: 16, color: '#333' }}>{new Date(selectedCompany.EndDate).toLocaleDateString()}</p>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row style={{ marginBottom: 20 }}>
                    <Col xs={24}>
                      <Form.Group>
                        <Form.ControlLabel style={{ fontSize: 16, fontWeight: 600, color: '#666' }}>Description</Form.ControlLabel>
                        <p style={{ fontSize: 16, color: '#333' }}>{selectedCompany.Description}</p>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row style={{ marginBottom: 20 }}>
                    <Col xs={12}>
                      <Form.Group>
                        <Form.ControlLabel style={{ fontSize: 16, fontWeight: 600, color: '#666' }}>Offer Type</Form.ControlLabel>
                        <p style={{ fontSize: 16, color: '#333' }}>{selectedCompany.OfferType}</p>
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Form.Group>
                        <Form.ControlLabel style={{ fontSize: 16, fontWeight: 600, color: '#666' }}>CTC</Form.ControlLabel>
                        <p style={{ fontSize: 16, color: '#333' }}>{selectedCompany.CTC}</p>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row style={{ marginBottom: 20 }}>
                    <Col xs={12}>
                      <Form.Group>
                        <Form.ControlLabel style={{ fontSize: 16, fontWeight: 600, color: '#666' }}>Branch</Form.ControlLabel>
                        <p style={{ fontSize: 16, color: '#333' }}>{selectedCompany.Branch}</p>
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Form.Group>
                        <Form.ControlLabel style={{ fontSize: 16, fontWeight: 600, color: '#666' }}>Backlog</Form.ControlLabel>
                        <p style={{ fontSize: 16, color: '#333' }}>{selectedCompany.Backlog}</p>
                      </Form.Group>
                    </Col>
                   
                    
                  </Row>
                  <Row style={{ marginBottom: 20 }}>
                     <Col xs={12}>
                      <Form.Group>
                        <Form.ControlLabel style={{ fontSize: 16, fontWeight: 600, color: '#666' }}>CGPA Requirement</Form.ControlLabel>
                        <p style={{ fontSize: 16, color: '#333' }}>{selectedCompany.CGPA}</p>
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Form.Group>
                        <Form.ControlLabel style={{ fontSize: 16, fontWeight: 600, color: '#666' }}>10th Requirement %</Form.ControlLabel>
                        <p style={{ fontSize: 16, color: '#333' }}>{selectedCompany.Tenth}</p>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row style={{ marginBottom: 20 }}>
                    <Col xs={12}>
                      <Form.Group>
                        <Form.ControlLabel style={{ fontSize: 16, fontWeight: 600, color: '#666' }}>12th Requirement %</Form.ControlLabel>
                        <p style={{ fontSize: 16, color: '#333' }}>{selectedCompany.Twelfth}</p>
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Form.Group>
                        <Form.ControlLabel style={{ fontSize: 16, fontWeight: 600, color: '#666' }}>KT</Form.ControlLabel>
                        <p style={{ fontSize: 16, color: '#333' }}>{selectedCompany.KT}</p>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row style={{ marginBottom: 20 }}>
                 
                    <Col xs={24}>
                      <Form.Group>
                        <Form.ControlLabel style={{ fontSize: 16, fontWeight: 600, color: '#666' }}>Documents</Form.ControlLabel>
                        <Link style={{ fontSize: 16, color: 'red' }} to={selectedCompany.Document} target="_blank">
                          <PageIcon/> View Document
                        </Link>
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </Panel>
            </div>
          ) : (
            <p style={{ fontSize: 16, color: '#333' }}>Loading company details...</p>
          )}
        </Modal.Body>
      <Modal.Footer style={{  padding: 20, borderRadius: 10 }}>
        <Button color='red' onClick={props.handleViewClose} appearance="primary" style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default View;