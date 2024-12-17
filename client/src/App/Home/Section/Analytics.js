import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";
import styled from "styled-components";
import moment from "moment";
import AdvancedAnalyticsIcon from "@rsuite/icons/AdvancedAnalytics";

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [ongoingDrives, setOngoingDrives] = useState(0);
  const [closedDrives, setClosedDrives] = useState(0);
  const [ctcData, setCtcData] = useState([]);
  const [optoutData, setOptoutData] = useState({
    totalStudents: 0,
    totalOptOuts: 0,
    remainingStudents: 0,
  });

  useEffect(() => {
    fetchAnalyticsData();
    fetchDriveData();
    fetchCtcData();
    fetchOptoutData(); // New function to fetch opt-out data
  }, []);

  // Fetches drive data
  const fetchDriveData = async () => {
    try {
      const response = await axios.get("/allCompany", {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("jwt"),
        },
      });
      if (response.data.Companies) {
        const today = moment();
        const formattedData = response.data.Companies.map((company) => ({
          id: company._id,
          companyName: company.CompanyName,
          startDate: moment(company.StartDate).format("DD/MM/YYYY"),
          endDate: moment(company.EndDate).format("DD/MM/YYYY"),
        }));

        const ongoing = formattedData.filter((drive) =>
          today.isBefore(moment(drive.endDate, "DD/MM/YYYY"))
        ).length;

        const closed = formattedData.filter((drive) =>
          today.isAfter(moment(drive.endDate, "DD/MM/YYYY"))
        ).length;

        setOngoingDrives(ongoing);
        setClosedDrives(closed);
      }
    } catch (error) {
      console.error("Error fetching drive data", error);
    }
  };

  // Fetches analytics data
  const fetchAnalyticsData = async () => {
    try {
      const response = await axios.get("/analytics", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
        },
      });
      setAnalyticsData(response.data);
    } catch (error) {
      console.error("Error fetching analytics data", error);
    }
  };

  // Fetches CTC data by branch
  const fetchCtcData = async () => {
    try {
      const response = await axios.get("/average-ctc-by-branch");
      const formattedData = response.data.map((branch) => ({
        branch: branch._id,
        avgCTC: branch.avgCTC,
      }));
      setCtcData(formattedData);
    } catch (error) {
      console.error("Error fetching CTC data", error);
    }
  };

  // Fetches opt-out analysis data
  const fetchOptoutData = async () => {
    try {
      const response = await axios.get("/optoutanalysis", {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("jwt"), // Use JWT stored in sessionStorage for authorization
        },
      });
      if (response.data) {
        // Process the opt-out data here
        setOptoutData(response.data);
      }
    } catch (error) {
      console.error("Error fetching opt-out data", error);
    }
  };

  // Pie chart data for drive status
  const pieData = [
    { name: "Ongoing Drives", value: ongoingDrives },
    { name: "Closed Drives", value: closedDrives },
  ];

  const COLORS = ["#a3a3c2", "#af1111"];

  if (!analyticsData || !optoutData) {
    return <LoadingContainer>Loading analytics...</LoadingContainer>;
  }

  return (
    <AnalyticsContainer>
      <HeaderContainer>
        <h1>Drive Analytics {moment().format("YYYY")}</h1>
        <AdvancedAnalyticsIcon color="#af1111" style={{ fontSize: "30px" }} />
      </HeaderContainer>
      <Container>
        {/* Company Arrivals Panel */}
        <Card>
          <PanelContainer>
            <PanelHeader>Company Arrivals</PanelHeader>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  {
                    name: "Placement",
                    value: analyticsData.placementCompanies,
                  },
                  {
                    name: "Placement + PPO",
                    value: analyticsData.placementPpoCompanies,
                  },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: "#f5f5f5" }} />
                <Legend />
                <Bar dataKey="value" fill="#af1111" animationDuration={1500} />
              </BarChart>
            </ResponsiveContainer>
          </PanelContainer>
        </Card>

        {/* Drives Status Panel */}
        <Card>
          <PanelContainer>
            <PanelHeader>Drives Status</PanelHeader>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  dataKey="value"
                  animationDuration={1500}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#f5f5f5" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </PanelContainer>
        </Card>

        {/* Average CTC by Branch Panel */}
        <Card>
          <PanelContainer>
            <PanelHeader>Average CTC by Branch</PanelHeader>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={ctcData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="branch" />
                <Radar
                  name="CTC"
                  dataKey="avgCTC"
                  stroke="#af1111"
                  fill="#af1111"
                  fillOpacity={0.6}
                />
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </PanelContainer>
        </Card>

        {/* Opt-Out Analysis Panel */}
        <Card>
          <PanelContainer>
            <PanelHeader>Opt-Out Analysis</PanelHeader>
            <div>
              <h3>Total Students: {optoutData.totalStudents}</h3>
              <h3>Opt-Out Students: {optoutData.totalOptOuts}</h3>
              <h3>Remaining Students: {optoutData.remainingStudents}</h3>
            </div>
          </PanelContainer>
        </Card>
      </Container>
    </AnalyticsContainer>
  );
};

export default Analytics;

// Styled components remain the same


// Styled components
const AnalyticsContainer = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
  width: 100%;
  box-sizing: border-box;
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  h1 {
    font-size: 1.8em;
    color: #af1111;
    @media (max-width: 768px) {
      font-size: 1.5em;
    }
    @media (max-width: 480px) {
      font-size: 1.2em;
    }
  }
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
  width: 100%;
  align-items: flex-start;
  justify-content: space-around;
  margin-top: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  overflow: hidden;
  flex: 1;
  max-width: 450px;
  min-width: 300px;
  margin: 10px;
  @media (max-width: 768px) {
    max-width: 90%;
    width: 100%;
  }
`;

const PanelContainer = styled.div`
  padding: 20px;
  box-sizing: border-box;
`;

const PanelHeader = styled.h2`
  font-size: 1.5em;
  color: #af1111;
  margin-bottom: 20px;
  @media (max-width: 480px) {
    font-size: 1.2em;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5em;
  color: #af1111;
`;