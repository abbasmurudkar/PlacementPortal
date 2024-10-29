import React, { useEffect, useState } from "react";
import { Button, Input, InputGroup, SelectPicker, TagPicker } from "rsuite";
import styled from "styled-components";
import FileDownloadIcon from "@rsuite/icons/FileDownload";
import SearchPeopleIcon from "@rsuite/icons/SearchPeople";
import axios from "axios";
import * as XLSX from "xlsx";
import moment from "moment";
import { Cell, Column, HeaderCell, Table } from "rsuite-table";

const StudentMaster = () => {
  const [studentData, setStudentData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filters
  const [branchFilter, setBranchFilter] = useState([]);
  const [tenthPercent, setTenthPercent] = useState("");
  const [twelfthPercent, setTwelfthPercent] = useState("");
  const [ktFilter, setKtFilter] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/StudentMasterData", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
          },
        });
        const result = await res.data;
        setStudentData(result);
        setFilteredData(result); 
      } catch (error) {
        console.error("Error fetching ", error);
      }
    };
    fetchData();
  }, []);

  // Filter logic
  useEffect(() => {
    let data = [...studentData];

    if (searchQuery) {
      data = data.filter((student) =>
        student.studentFullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (branchFilter && branchFilter.length > 0) {
      data = data.filter((student) =>
        branchFilter.includes(student.branch)
      );
    }

    if (tenthPercent) {
      data = data.filter(
        (student) =>
          parseFloat(student.tenthPercent) >= parseFloat(tenthPercent)
      );
    }

    if (twelfthPercent) {
      data = data.filter(
        (student) =>
          student.twelfthPercent &&
          parseFloat(student.twelfthPercent) >= parseFloat(twelfthPercent)
      );
    }

    // Apply KT filter (check if dead/live KTs are "0" or greater than "0")
    if (ktFilter === "No KTs") {
      data = data.filter(
        (student) => student.deadKTs === "0" && student.liveKTs === "0"
      );
    } else if (ktFilter === "Has KTs") {
      data = data.filter(
        (student) => student.deadKTs > "0" || student.liveKTs > "0"
      );
    }


    setFilteredData(data);
  }, [searchQuery,branchFilter, tenthPercent, twelfthPercent, ktFilter, studentData]);

  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "StudentData");
    XLSX.writeFile(wb, `StudentMasterData ${moment().format("YYYY")}.xlsx`);
  };

  const branches = [
    { label: "Information Technology", value: "IT" },
    { label: "Computer Science", value: "CS" },
    { label: "Cyber Security", value: "CE" },
  ];

  const ktOptions = [
    { label: "No KTs", value: "No KTs" },
    { label: "Has KTs", value: "Has KTs" },
  ];

  const handleClearFilters = () => {
    setBranchFilter([]);
    setTenthPercent("");
    setTwelfthPercent("");
    setKtFilter(null);
    setFilteredData(studentData); // Reset data to original
  };

  return (
    <Card>
      <CardHeader>Student Master Database</CardHeader>
      <Block1>
        <InputGroup className="inputgroup">
          <Input
            placeholder="Search for Name"
            type="text"
            onChange={(value) => setSearchQuery(value)}
            value={searchQuery}
          />
          <InputGroup.Addon>{<SearchPeopleIcon />}</InputGroup.Addon>
        </InputGroup>

        <FilterSection>
          <TagPicker
            data={branches}
            placeholder="Select Branches"
            value={branchFilter}
            onChange={setBranchFilter}
            style={{ width: 300 }}
          />
          <Input
            placeholder="Enter 10th Percent"
            value={tenthPercent}
            onChange={(value) => setTenthPercent(value)}
            style={{ width: 200 }}
            type="number"
          />
          <Input
            placeholder="Enter 12th Percent"
            value={twelfthPercent}
            onChange={(value) => setTwelfthPercent(value)}
            style={{ width: 200 }}
            type="number"
          />
           <SelectPicker
            data={ktOptions}
            placeholder="Select KT Filter"
            value={ktFilter}
            onChange={setKtFilter}
            style={{ width: 200 }}
          />
        </FilterSection>

        <div
          className="button-block"
          style={{
            display: "flex",
            justifyContent: "start",
            width: "50%",
            flexWrap: "wrap",
          }}
        >
          <Button appearance="primary" color="red" onClick={handleDownload}>
            Download <FileDownloadIcon style={{ marginLeft: "10px" }} />
          </Button>
          <Button appearance="default" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </div>
      </Block1>

      <Block2>
        <Table height={400} data={filteredData}>
          <Column width={200} align="center">
            <HeaderCell>Id</HeaderCell>
            <Cell dataKey="_id" />
          </Column>
          <Column width={200} align="center">
            <HeaderCell>Campus</HeaderCell>
            <Cell dataKey="campus" />
          </Column>
          <Column width={200} align="center">
            <HeaderCell>Program</HeaderCell>
            <Cell dataKey="program" />
          </Column>
          <Column width={200} align="center">
            <HeaderCell>Branch</HeaderCell>
            <Cell dataKey="branch" />
          </Column>
          <Column width={200} align="center">
            <HeaderCell>SAP ID</HeaderCell>
            <Cell dataKey="sapId" />
          </Column>
          <Column width={200} align="center">
            <HeaderCell>Student Name</HeaderCell>
            <Cell dataKey="studentFullName" />
          </Column>
          <Column width={200} align="center">
            <HeaderCell>Email</HeaderCell>
            <Cell dataKey="mailId" />
          </Column>
          <Column width={200} align="center">
            <HeaderCell>Gender</HeaderCell>
            <Cell dataKey="gender" />
          </Column>
          <Column width={200} align="center">
            <HeaderCell>Contact</HeaderCell>
            <Cell dataKey="contact" />
          </Column>
          <Column width={200} align="center">
            <HeaderCell>10th Percent</HeaderCell>
            <Cell dataKey="tenthPercent" />
          </Column>
          <Column width={200} align="center">
            <HeaderCell>12th Percent</HeaderCell>
            <Cell dataKey="twelfthPercent" />
          </Column>
          <Column width={200} align="center">
            <HeaderCell>Dead KTs</HeaderCell>
            <Cell dataKey="deadKTs" />
          </Column>
          <Column width={200} align="center">
            <HeaderCell>Live KTs</HeaderCell>
            <Cell dataKey="liveKTs" />
          </Column>
        </Table>
      </Block2>
    </Card>
  );
};

export default StudentMaster;

// Styled Components
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

const FilterSection = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const Block2 = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2%;
`;