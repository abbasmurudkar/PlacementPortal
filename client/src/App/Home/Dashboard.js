import React, { useState } from 'react';
import Navbar from '../Common/Navbar';
import styled from 'styled-components';
import BarLineChartIcon from '@rsuite/icons/BarLineChart';
import TaskIcon from '@rsuite/icons/Task';
import ChangeListIcon from '@rsuite/icons/ChangeList';
import WechatOutlineIcon from '@rsuite/icons/WechatOutline';
import UserBadgeIcon from '@rsuite/icons/UserBadge';
import { Route, Routes } from 'react-router';
import Companylisting from './Section/Companylisting';
import StudentData from './Section/StudentData';
import StudentAssessment from './Section/StudentAssessment';
import Analytics from './Section/Analytics';
import ViewQueries from './Section/ViewQueries';

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [Editcompany, SetEditeCompany] = useState(false)
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleViewOpen = ()=> setOpenView(true);
  const handleViewClose = () => setOpenView(false)
  const setEditeOpen = ()=> SetEditeCompany(true)
  const setEditClose = () => SetEditeCompany(false)
  const Routing = [
    {
      to: "/Dashboard",
      txt: "Company Listing",
      icon: <ChangeListIcon />,
      component:<Companylisting/>
    },
    {
      to: "StudentData",
      txt: "Student Data",
      icon: <UserBadgeIcon />,
      component :<StudentData/>
    },
    {
      to: "StudentAssessments",
      txt: "Student Assessments",
      icon: <TaskIcon />,
      component: <StudentAssessment/>
    },
    {
      to: "ViewQueries",
      txt: "View Queries",
      icon: <WechatOutlineIcon />,
      component:<ViewQueries/>
    },
    {
      to: "Analytics",
      txt: "Analysis",
      icon: <BarLineChartIcon />,
      component:<Analytics/>
    },
  ];

  return (
    <div>
      <Navbar Routes={Routing} />
      <Content>
        <Routes>
          <Route index element={<Companylisting open={open} openView={openView} Editcompany={Editcompany}  handleOpen={handleOpen} handleClose={handleClose} handleViewOpen={handleViewOpen} handleViewClose={handleViewClose} setEditeOpen={setEditeOpen} setEditClose={setEditClose}/>} />
          {
            Routing.map((ele, key) => (
              <Route  key={key} path={ele.to} element={ele.component}  />
            ))
          }
        </Routes>
      </Content>
    </div>
  );
};

export default Dashboard;

const Content = styled.div`
  margin-top: 20px;
  padding: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 0;

`;
