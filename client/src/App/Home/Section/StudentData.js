import { useState, useEffect } from "react";
import {
  Button,
  Input,
  InputGroup,
  Notification,
  toaster,
  Uploader,
} from "rsuite";
import { Cell, Column, HeaderCell, Table } from "rsuite-table";
import SearchPeopleIcon from "@rsuite/icons/SearchPeople";
import styled from "styled-components";
import Papa from "papaparse";
import moment from "moment";
import * as XLSX from "xlsx";
import StudentCredentialModel from "../Components/StudentCredentialModel";
import FileUploadIcon from "@rsuite/icons/FileUpload";
import FileDownloadIcon from "@rsuite/icons/FileDownload";
import StudentEdit from "../Components/StudentEdit";
import StudentMaster from "../../Forms/StudentMaster";

const StudentData = () => {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [isDataSaved, setIsDataSaved] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [StudentCredentialModelOpen, serStudentCredentialModelOpen] =
    useState(false);
  const [existingSapIds, setExistingSapIds] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const fetchData = async () => {
    try {
      const res = await fetch("/StudentsCredentials", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
        },
      });
      const result = await res.json();
      setData(result);
      setIsDataSaved(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchExistingSapIds = async () => {
    try {
      const res = await fetch("/StudentsCredentials", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
        },
      });
      const result = await res.json();
      const sapIds = result.map((student) => student.sapId.toString());
      setExistingSapIds(sapIds);
    } catch (error) {
      console.error("Error fetching existing SAP IDs:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchExistingSapIds();
  }, []);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    const filteredData = data.sort((a, b) => {
      const companyNameA = a.fullStudentName.toLowerCase();
      const companyNameB = b.fullStudentName.toLowerCase();
      const searchQueryLower = value.toLowerCase();
      if (
        companyNameA.includes(searchQueryLower) &&
        !companyNameB.includes(searchQueryLower)
      ) {
        return -1;
      } else if (
        !companyNameA.includes(searchQueryLower) &&
        companyNameB.includes(searchQueryLower)
      ) {
        return 1;
      } else {
        return 0;
      }
    });
    setData(filteredData);
  };

  const handleFileUpload = (fileList) => {
    setFileList([]);
    setFile(null);
    const file = fileList[0]?.blobFile;
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const contents = e.target.result;
        Papa.parse(contents, {
          header: true,
          dynamicTyping: true,
          complete: function (results) {
            const filteredData = results.data.filter(
              (student) =>
                student.fullStudentName &&
                student.sapId &&
                student.defaultPassword
            );

            const newStudents = filteredData.filter(
              (student) => !existingSapIds.includes(student.sapId.toString())
            );

            if (newStudents.length < filteredData.length) {
              toaster.push(
                <Notification type="warning" header="Warning">
                  Some SAP IDs already exist and have been excluded from upload.
                </Notification>,
                { placement: "topCenter", duration: 3000 }
              );
              fetchData();
            }

            setData(newStudents);
            setIsDataSaved(false);
          },
          error: function (error) {
            console.error("Error parsing CSV:", error);
          },
        });
      };
      reader.readAsText(file);
    }
  };

  const handleSave = async () => {
    try {
      console.log("Data to save:", data);

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Data must be a non-empty array.");
      }

      data.forEach((student, index) => {
        if (
          !student.fullStudentName ||
          !student.sapId ||
          !student.defaultPassword
        ) {
          console.error(
            `Missing fields in student at index ${index}:`,
            student
          );
          throw new Error("Missing required fields in student data.");
        }
      });

      const response = await fetch("/StudentsCredentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("jwt"),
        },
        body: JSON.stringify(data),
      });

      console.log("Response:", response);

      if (response.ok) {
        toaster.push(
          <Notification type="success" header="Success">
            Data saved successfully
          </Notification>,
          { placement: "topCenter", duration: 3000 }
        );
        setIsDataSaved(true);
        fetchData();
        fetchExistingSapIds();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toaster.push(
        <Notification type="error" header="Error">
          {error.message}
        </Notification>,
        { placement: "topCenter", duration: 3000 }
      );
    }
  };

  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "StudentData");
    XLSX.writeFile(
      wb,
      `StudentCredentials_${moment().format("YYYY")}.xlsx`
    );
  };

  const handleCreateUser = async (student) => {
    try {
      const response = await fetch("/StudentsCredentials/Insert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("jwt"),
        },
        body: JSON.stringify(student),
      });

      if (response.ok) {
        toaster.push(
          <Notification type="success" header="Success">
            User created successfully
          </Notification>,
          { placement: "topCenter", duration: 3000 }
        );
        serStudentCredentialModelOpen(false);
        fetchData();
      } else {
        const errorData = await response.json();
        if (
          response.status === 400 &&
          errorData.message === "Duplicate SAP ID detected"
        ) {
          toaster.push(
            <Notification type="error" header="Error">
              SAP ID already exists!
            </Notification>,
            { placement: "topCenter", duration: 3000 }
          );
        } else {
          throw new Error(errorData.message);
        }
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toaster.push(
        <Notification type="error" header="Error">
          {error.message}
        </Notification>,
        { placement: "topCenter", duration: 3000 }
      );
    }
  };

  const handleEdit = (rowData) => {
    setSelectedRowId(rowData._id);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (rowId, updatedStudent) => {
    try {
      const response = await fetch(`/StudentsCredentials/${rowId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("jwt"),
        },
        body: JSON.stringify(updatedStudent),
      });

      if (response.ok) {
        toaster.push(
          <Notification type="success" header="Success">
            Data updated successfully
          </Notification>,
          { placement: "topCenter", duration: 3000 }
        );
        fetchData();
        setEditModalOpen(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error("Error updating data:", error);
      toaster.push(
        <Notification type="error" header="Error">
          {error.message}
        </Notification>,
        { placement: "topCenter", duration: 3000 }
      );
    }
  };
  return (
    <MainBox>
      <Card>
        <CardHeader>Student Credentials</CardHeader>
        <Block1>
          <InputGroup className="inputgroup">
            <Input
              placeholder="Search for Name"
              type="text"
              value={searchQuery}
              onChange={(value) => handleSearchChange(value)}
            />
            <InputGroup.Addon>{<SearchPeopleIcon />}</InputGroup.Addon>
          </InputGroup>
          <div
            className="button-block"
            style={{
              display: "flex",
              justifyContent: "space-around",
              width: "50%",
              flexWrap: "wrap",
            }}
          >
            <Button
              appearance="primary"
              color="red"
              disabled={!isDataSaved}
              onClick={() => serStudentCredentialModelOpen(true)}
            >
              Create User
            </Button>
            <Button
              appearance="primary"
              color="red"
              disabled={!isDataSaved}
              onClick={handleDownload}
            >
              Download <FileDownloadIcon style={{ marginLeft: "10px" }} />
            </Button>

            <Button appearance="primary" color="red" onClick={handleSave}>
              Save
            </Button>
            <Uploader
              autoUpload={false}
              fileListVisible={false}
              fileList={fileList}
              action="#"
              onChange={handleFileUpload}
            >
              <Button>
                Select files...{" "}
                <FileUploadIcon style={{ marginLeft: "10px" }} />
              </Button>
            </Uploader>
          </div>
        </Block1>
        <Block2>
          <Table height={400} data={data}>
            <Column width={200} align="center">
              <HeaderCell>Id</HeaderCell>
              <Cell dataKey="_id" />
            </Column>
            <Column width={200} align="center">
              <HeaderCell>Student Name</HeaderCell>
              <Cell dataKey="fullStudentName" />
            </Column>
            <Column width={200} align="center">
              <HeaderCell>SAP ID</HeaderCell>
              <Cell dataKey="sapId" />
            </Column>
            <Column width={200} align="center">
              <HeaderCell>Default Password</HeaderCell>
              <Cell dataKey="defaultPassword" />
            </Column>
            <Column width={200} align="center">
              <HeaderCell>Edit</HeaderCell>
              <Cell>
                {(rowData) => (
                  <Button
                    appearance="link"
                    color="red"
                    disabled={!isDataSaved}
                    onClick={() => handleEdit(rowData)}
                  >
                    Edit
                  </Button>
                )}
              </Cell>
            </Column>
          </Table>
        </Block2>
      </Card>
      <StudentCredentialModel
        open={StudentCredentialModelOpen}
        onClose={() => serStudentCredentialModelOpen(false)}
        onSave={handleCreateUser}
      />
      {selectedRowId && (
        <StudentEdit
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={handleSaveEdit}
          rowId={selectedRowId}
        />
      )}
    <StudentMaster />
    </MainBox>
  );
};
export default StudentData;
const MainBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  background-color: white;
  border-radius: 10px;
  margin-bottom: 30px;
`;

const CardHeader = styled.div`
  background-color: #4d4d4d;
  color: white;
  font-size: 20px;
  padding: 1%;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const Block1 = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 1%;
  gap: 20px;
  @media (max-width: 768px) {
    width: 100%;
  }
  button {
    margin-right: 20px;
    @media (max-width: 768px) {
      width: 70%;
      margin-bottom: 20px;
    }
  }
  .button-block {
    @media (max-width: 768px) {
      width: 100vw;
      flex-direction: row;
    }
  }
`;
const Block2 = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2%;
`;
