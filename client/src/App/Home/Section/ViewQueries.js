import React, { useEffect, useState } from 'react';
import { Button, Table } from 'rsuite';
import ArrowUpIcon from '@rsuite/icons/ArrowUp';
import ArrowDownIcon from '@rsuite/icons/ArrowDown';
import axios from 'axios';
import styled from 'styled-components';

const { Column, HeaderCell, Cell } = Table;

// Styled Components
const Container = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  margin: 20px auto;
`;

const RefreshButton = styled(Button)`
  background-color: #af1111!important;
  border-color: #af1111 !important;
  color: #fff !important;
  margin-bottom: 20px;
  &:hover {
    background-color: #0056b3 !important;
    border-color: #0056b3 !important;
  }
`;

const TableWrapper = styled.div`
  margin-top: 20px;
  .rs-table-cell {
    padding: 10px !important;
  }
`;

const RowWrapper = styled.div`
  margin-top: 10px;
  transition: all 0.3s ease;
`;

const OptOutTableWrapper = styled.div`
  margin-top: 40px;
`;

const ViewQueries = () => {
  const [data, setData] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [optOutStudents, setOptOutStudents] = useState([]);

  // Fetch data for applications and opt-out students
  const fetchData = async () => {
    try {
      // Fetching applications data
      const response = await axios.get('/applications', {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('jwt')}`,
        },
      });

      // Grouping applications by company name and then by student
      const groupedData = response.data.reduce((acc, application) => {
        const companyName = application.companyName;
        const studentName = application.studentName;

        if (!acc[companyName]) {
          acc[companyName] = {
            companyName,
            children: [],
          };
        }
        acc[companyName].children.push({
          id: application._id,
          sapId: application.sapId,
          appliedOn: new Date(application.appliedOn).toLocaleDateString(),
          status: application.status,
          studentName,
        });
        return acc;
      }, {});

      setData(Object.values(groupedData));

      // Fetching opt-out students
      const optOutResponse = await axios.get('/optoutstudents', {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('jwt')}`,
        },
      });
      setOptOutStudents(optOutResponse.data);  
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); 

  const handleExpand = (rowData) => {
    const newExpandedRowKeys = expandedRowKeys.includes(rowData.companyName)
      ? []  
      : [rowData.companyName];
    setExpandedRowKeys(newExpandedRowKeys);
  };

  return (
    <Container>
      <RefreshButton onClick={fetchData}>Refresh Data</RefreshButton>

      <TableWrapper>
        <Table
          bordered
          cellBordered
          height={250}
          rowKey="companyName"
          data={data}
          expandedRowKeys={expandedRowKeys}
          onRowClick={(rowData) => handleExpand(rowData)} 
          renderTreeToggle={(icon, rowData) => {
            if (rowData.children && rowData.children.length > 0) {
              return expandedRowKeys.includes(rowData.companyName) ? (
                <ArrowUpIcon onClick={() => handleExpand(rowData)} />
              ) : (
                <ArrowDownIcon onClick={() => handleExpand(rowData)} />
              );
            }
            return null;
          }}
        >
          <Column flexGrow={1}>
            <HeaderCell>Company Name</HeaderCell>
            <Cell dataKey="companyName" />
          </Column>
          <Column width={200}>
            <HeaderCell>SAP ID</HeaderCell>
            <Cell dataKey="sapId" />
          </Column>
          <Column width={150}>
            <HeaderCell>Applied On</HeaderCell>
            <Cell dataKey="appliedOn" />
          </Column>
          <Column width={150}>
            <HeaderCell>Status</HeaderCell>
            <Cell dataKey="status" />
          </Column>
        </Table>
        
        {data.map((rowData) =>
          expandedRowKeys.includes(rowData.companyName) && rowData.children ? (
            <RowWrapper key={rowData.companyName}>
              <Table
                data={rowData.children}
                rowKey="id"
                height={250}
                bordered
                cellBordered
                style={{  marginTop: '10px', backgroundColor: '#f9f9f9', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}
              >
                <Column flexGrow={1}>
                  <HeaderCell>List of Student</HeaderCell>
                  <Cell dataKey="studentName" />
                </Column>
                <Column width={200}>
                  <HeaderCell>SAP ID</HeaderCell>
                  <Cell dataKey="sapId" />
                </Column>
                <Column width={150}>
                  <HeaderCell>Applied On</HeaderCell>
                  <Cell dataKey="appliedOn" />
                </Column>
                <Column width={150}>
                  <HeaderCell>Status</HeaderCell>
                  <Cell dataKey="status" />
                </Column>
              </Table>
            </RowWrapper>
          ) : null
        )}
      </TableWrapper>

      <OptOutTableWrapper style={{marginTop:"200px"}}>
  <h3>Opt-Out Students</h3>
  <Table
    bordered
    cellBordered
    rowKey="sapId"
    data={optOutStudents}
    style={{ marginTop: '20px' }}
  >
    <Column flexGrow={1}>
      <HeaderCell>Student Name</HeaderCell>
      <Cell dataKey="name" />
    </Column>
    <Column flexGrow={1}>
      <HeaderCell>Program</HeaderCell>
      <Cell dataKey="program" />
    </Column>
    <Column flexGrow={1}>
      <HeaderCell>Branch</HeaderCell>
      <Cell dataKey="branch" />
    </Column>
    <Column width={200}>
      <HeaderCell>SAP ID</HeaderCell>
      <Cell dataKey="sapId" />
    </Column>
    <Column width={150}>
      <HeaderCell>Further Studies</HeaderCell>
      <Cell>
        {(rowData) => (rowData.reasons.furtherStudies ? 'Yes' : 'No')}
      </Cell>
    </Column>
    <Column width={150}>
      <HeaderCell>Startup</HeaderCell>
      <Cell>
        {(rowData) => (rowData.reasons.startup ? 'Yes' : 'No')}
      </Cell>
    </Column>
    <Column width={150}>
      <HeaderCell>Family Business</HeaderCell>
      <Cell>
        {(rowData) => (rowData.reasons.familyBusiness ? 'Yes' : 'No')}
      </Cell>
    </Column>
    <Column width={150}>
      <HeaderCell>Other</HeaderCell>
      <Cell>
        {(rowData) => (rowData.reasons.other ? 'Yes' : 'No')}
      </Cell>
    </Column>
  </Table>
</OptOutTableWrapper>

    </Container>
  );
};

export default ViewQueries;
