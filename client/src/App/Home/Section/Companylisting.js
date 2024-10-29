import React, { useEffect, useState } from "react";
import { Button, Input, InputGroup } from "rsuite";
import styled from "styled-components";
import SearchPeopleIcon from "@rsuite/icons/SearchPeople";
import { Cell, Column, HeaderCell, Table } from "rsuite-table";
import Model from "../Components/CompanyModal";
import { Link } from "react-router-dom";
import moment from "moment";
import View from "../Components/CompanyView";
import EditCompanyModal from "../Components/CompanyEdit";

const Companylisting = (prop) => {
  const [userData, setUserData] = useState([]);
  const [closedDrives, setClosedDrives] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [closedDriveQuery, setClosedDrivesQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [refreshData, setRefreshData] = useState(false);
  const handleViewClick = (company) => {
    fetch(`/company/${company}`, {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setSelectedCompany(result.company);
        console.log(result);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleSaveEdit = (updatedCompany) => {
    setUserData(userData.map(company => (company.id === updatedCompany.id ? updatedCompany : company)));
    setClosedDrives(closedDrives.map(company => (company.id === updatedCompany.id ? updatedCompany : company)));
    setRefreshData(!refreshData);
  };

  useEffect(() => {
    fetch("/allCompany", {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.Companies) {
          const formattedData = result.Companies.map((company) => ({
            id: company._id,
            companyName: company.CompanyName,
            offerType: company.OfferType,
            startDate: new Date(company.StartDate).toLocaleDateString(),
            endDate: new Date(company.EndDate).toLocaleDateString(),
            attachments: company.Document,
          }));
          const today = Date.now();
          const ongoingDrives = formattedData.filter((item) => {
            const endDateTimestamp = moment(
              item.endDate,
              "DD/MM/YYYY"
            ).valueOf();
            return endDateTimestamp >= today;
          });
          const filteredClosedDrives = formattedData.filter((item) => {
            const endDateTimestamp = moment(
              item.endDate,
              "DD/MM/YYYY"
            ).valueOf();
            return endDateTimestamp < today;
          });

          setUserData(ongoingDrives);
          setClosedDrives(filteredClosedDrives);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [prop.open,refreshData]);// eslint-disable-next-line

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    const filteredData = userData.sort((a, b) => {
      const companyNameA = a.companyName.toLowerCase();
      const companyNameB = b.companyName.toLowerCase();
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
    setUserData(filteredData);
  };

  const handleFilterdclosedDrive = (value) => {
    setClosedDrivesQuery(value);
    const filteredData = closedDrives.sort((a, b) => {
      const companyNameA = a.companyName.toLowerCase();
      const companyNameB = b.companyName.toLowerCase();
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
    setClosedDrives(filteredData);
  };

  return (
    <MainBox>
      <Card>
        <CardHeader>Ongoing Drives</CardHeader>
        <Block1>
          <InputGroup className="inputgroup">
            <Input
              placeholder="Search for result"
              value={searchQuery}
              onChange={(value) => handleSearchChange(value)}
              type="text"
            />
            <InputGroup.Addon>{<SearchPeopleIcon />}</InputGroup.Addon>
          </InputGroup>
          <Button appearance="primary" color="red" onClick={prop.handleOpen}>
            Create new
          </Button>
        </Block1>
        <Block2>
          <Table height={400} data={userData}>
            <Column width={60} align="center" fixed>
              <HeaderCell>Id</HeaderCell>
              <Cell dataKey="_id" />
            </Column>
            <Column width={250} align="center">
              <HeaderCell>Company Name</HeaderCell>
              <Cell dataKey="companyName" />
            </Column>
            <Column width={150} align="center">
              <HeaderCell>Offer Type</HeaderCell>
              <Cell dataKey="offerType" />
            </Column>
            <Column width={150} align="center">
              <HeaderCell>Start Date</HeaderCell>
              <Cell dataKey="startDate" />
            </Column>
            <Column width={150} align="center">
              <HeaderCell>End Date</HeaderCell>
              <Cell dataKey="endDate" />
            </Column>
            <Column width={200} align="center">
              <HeaderCell>Attachments</HeaderCell>
              <Cell dataKey="attachments">
                {(rowData) => (
                  <Button appearance="link" color="red">
                    <Link
                      to={rowData.attachments}
                      target="_blank"
                      style={{ color: "red" }}
                    >
                      View Attachment
                    </Link>
                  </Button>
                )}
              </Cell>
            </Column>
            <Column width={100} align="center">
              <HeaderCell>View</HeaderCell>
              <Cell>
                {(rowData) => (
                  <Button
                    appearance="link"
                    color="red"
                    onClick={() => {handleViewClick(rowData.id);prop.handleViewOpen();}}
                  >
                    View
                  </Button>
                )}
              </Cell>
            </Column>
            <Column width={100} align="center">
              <HeaderCell>Edit</HeaderCell>
              <Cell>
                {(rowData) => (
                  <Button
                    appearance="link"
                    color="red"
                    onClick={() => {handleViewClick(rowData.id);prop.setEditeOpen()}}
                  >
                    Edit
                  </Button>
                )}
              </Cell>
            </Column>
          </Table>
        </Block2>
      </Card>
      <Card>
        <CardHeader>Closed Drives</CardHeader>
        <Block1>
          <InputGroup className="inputgroup">
            <Input
              placeholder="Search for result"
              value={closedDriveQuery}
              onChange={(value) => handleFilterdclosedDrive(value)}
              type="text"
            />
            <InputGroup.Addon>{<SearchPeopleIcon />}</InputGroup.Addon>
          </InputGroup>
        </Block1>
        <Block2>
          <Table height={400} data={closedDrives}>
            <Column width={60} align="center" fixed>
              <HeaderCell>Id</HeaderCell>
              <Cell dataKey="id" />
            </Column>
            <Column width={250} align="center">
              <HeaderCell>Company Name</HeaderCell>
              <Cell dataKey="companyName" />
            </Column>
            <Column width={150} align="center">
              <HeaderCell>Offer Type</HeaderCell>
              <Cell dataKey="offerType" />
            </Column>
            <Column width={150} align="center">
              <HeaderCell>End Date</HeaderCell>
              <Cell dataKey="endDate" />
            </Column>
            <Column width={200} align="center">
              <HeaderCell>Attachments</HeaderCell>
              <Cell dataKey="attachments">
                {(rowData) => (
                  <Button appearance="link" color="red">
                    <Link
                      to={rowData.attachments}
                      target="_blank"
                      style={{ color: "red" }}
                    >
                      View Attachment
                    </Link>
                  </Button>
                )}
              </Cell>
            </Column>
            <Column width={100} align="center">
              <HeaderCell>View</HeaderCell>
              <Cell>
                {(rowData) => (
                  <Button
                    appearance="link"
                    color="red"
                    onClick={() => {handleViewClick(rowData.id);prop.handleViewOpen();}}
                  >
                    View
                  </Button>
                )}
              </Cell>
            </Column>
            <Column width={100} align="center">
              <HeaderCell>Edit</HeaderCell>
              <Cell>
                {(rowData) => (
                  <Button
                    appearance="link"
                    color="red"
                    onClick={() =>{handleViewClick(rowData.id);prop.setEditeOpen()}}
                  >
                    Edit
                  </Button>
                )}
              </Cell>
            </Column>
          </Table>
        </Block2>
      </Card>
      {
        selectedCompany && <View
        handleViewOpen={prop.handleViewOpen}
        handleViewClose={prop.handleViewClose}
        openView={prop.openView}
        selectedCompany={selectedCompany}
        />
      }
      
      {
        selectedCompany && <EditCompanyModal
        open={prop.Editcompany}
        onClose={prop.setEditClose}
        onSave={handleSaveEdit}
        selectedCompany={selectedCompany}
      />
      }
      <Model
        handleClose={prop.handleClose}
        handleOpen={prop.handleOpen}
        open={prop.open}
      />
     
    </MainBox>
  );
};

export default Companylisting;

const MainBox = styled.div`
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    padding: 10px;
  }
  color: black !important;
`;

const Card = styled.div`
  margin-bottom: 20px;
  padding: 40px;
  border-radius: 8px;
  width: 100%;
  box-shadow: 0 4px 8px #af1111;
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const CardHeader = styled.h2`
  margin-bottom: 20px;
  font-size: 1.5em;
  color: #af1111;
`;

const Block1 = styled.div`
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .inputgroup {
    width: 250px;
    margin-bottom: 10px;
    @media (max-width: 768px) {
      width: 100%;
    }
  }
  button {
    @media (max-width: 768px) {
      width: 100%;
    }
  }
`;

const Block2 = styled.div`
  /* width: 100%; */
  /* overflow-x: auto; */
`;
