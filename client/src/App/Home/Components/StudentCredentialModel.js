import React, { useState, useEffect } from "react";
import { Button, Form, Input, InputGroup, Modal, Notification, toaster } from "rsuite";
import UserInfoIcon from "@rsuite/icons/UserInfo";
import IdInfoIcon from "@rsuite/icons/IdInfo";
import AdminIcon from "@rsuite/icons/Admin";

const StudentCredentialModel = ({ open, onClose, onSave }) => {
  const [formValue, setFormValue] = useState({
    UserName: "",
    SapId: "",
    Password: "",
  });

  const [formError, setFormError] = useState({});

  useEffect(() => {
    if (!open) {
      setFormValue({
        UserName: "",
        SapId: "",
        Password: "",
      });
      setFormError({});
    }
  }, [open]);

  const handleChange = (value) => {
    setFormValue(value);
  };

  const handleSubmit = async () => {
    const errors = {};

    if (!formValue.UserName) {
      errors.UserName = "UserName is required.";
    }
    if (!formValue.SapId) {
      errors.SapId = "SapId is required.";
    }
    if (!formValue.Password) {
      errors.Password = "Password is required.";
    }

    if (Object.keys(errors).length > 0) {
      setFormError(errors);
      return;
    }

    const student = {
      fullStudentName: formValue.UserName,
      sapId: formValue.SapId,
      defaultPassword: formValue.Password,
    };

    onSave(student);
    setFormValue({
      UserName: "",
      SapId: "",
      Password: "",
    });
    setFormError({});
  };

  return (
    <Modal open={open} size={"xs"} onClose={onClose}>
      <Modal.Header>
        <Modal.Title>Add Credentials</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form fluid onChange={handleChange} formValue={formValue} formError={formError}>
          <Form.Group controlId="UserName">
            <Form.ControlLabel>UserName: </Form.ControlLabel>
            <InputGroup inside>
              <InputGroup.Addon>
                <UserInfoIcon />
              </InputGroup.Addon>
              <Form.Control name="UserName" errorMessage={formError.UserName} />
            </InputGroup>
          </Form.Group>
          <Form.Group controlId="SapId">
            <Form.ControlLabel>SapId: </Form.ControlLabel>
            <InputGroup inside>
              <InputGroup.Addon>
                <IdInfoIcon />
              </InputGroup.Addon>
              <Form.Control name="SapId" errorMessage={formError.SapId} />
            </InputGroup>
          </Form.Group>
          <Form.Group controlId="Password">
            <Form.ControlLabel>Password: </Form.ControlLabel>
            <InputGroup inside>
              <InputGroup.Addon>
                <AdminIcon />
              </InputGroup.Addon>
              <Form.Control name="Password" type="password" errorMessage={formError.Password} />
            </InputGroup>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button appearance="primary" color="red" onClick={handleSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StudentCredentialModel;
