import { useState, useEffect } from "react";
import { Modal, Form, Button, Notification, toaster } from "rsuite";

const StudentEdit = ({ open, onClose, onSave, rowId }) => {
  const [student, setStudent] = useState({
    fullStudentName: "",
    sapId: "",
    defaultPassword: "",
  });

  useEffect(() => {
    const fetchStudentData = async () => {
      if (rowId) {
        try {
          const res = await fetch(`/StudentsCredentials/${rowId}`, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
            },
          });
          if (!res.ok) {
            throw new Error("Failed to fetch student data");
          }
          const result = await res.json();
          setStudent(result);
        } catch (error) {
          console.error("Error fetching student data:", error);
          toaster.push(
            <Notification type="error" header="Error">
              {error.message}
            </Notification>,
            { placement: "topCenter", duration: 3000 }
          );
        }
      }
    };

    fetchStudentData();
  }, [rowId]);

  const handleChange = (value, name) => {
    setStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!student.fullStudentName || !student.defaultPassword) {
      toaster.push(
        <Notification type="warning" header="Warning">
          Please fill in all required fields.
        </Notification>,
        { placement: "topCenter", duration: 3000 }
      );
      return;
    }

    onSave(rowId, student);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        <Modal.Title>Edit Student</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form fluid>
          <Form.Group>
            <Form.ControlLabel>Student Name</Form.ControlLabel>
            <Form.Control
              name="fullStudentName"
              value={student.fullStudentName}
              onChange={(value) => handleChange(value, "fullStudentName")}
            />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>SAP ID</Form.ControlLabel>
            <Form.Control
              name="sapId"
              value={student.sapId}
              onChange={(value) => handleChange(value, "sapId")}
              disabled
            />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Default Password</Form.ControlLabel>
            <Form.Control
              name="defaultPassword"
              value={student.defaultPassword}
              onChange={(value) => handleChange(value, "defaultPassword")}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSave} appearance="primary">
          Save
        </Button>
        <Button onClick={onClose} appearance="subtle">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StudentEdit;
