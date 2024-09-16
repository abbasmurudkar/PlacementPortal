import React, { useState } from "react";
import Nmims from "../../assets/Logo.png";
import AdminIcon from "@rsuite/icons/Admin";
import styled, { keyframes } from "styled-components";
import MenuIcon from '@rsuite/icons/Menu';
import BarLineChartIcon from '@rsuite/icons/BarLineChart';
import TaskIcon from '@rsuite/icons/Task';
import ChangeListIcon from '@rsuite/icons/ChangeList';
import PeopleBranchIcon from '@rsuite/icons/PeopleBranch';
import WechatOutlineIcon from '@rsuite/icons/WechatOutline';
import UserBadgeIcon from '@rsuite/icons/UserBadge';
import CloseIcon from '@rsuite/icons/Close';


const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Wrapper>
      <LogoSection style={{background:"white"}}>
        <img src={Nmims} alt="Loading" />
      </LogoSection>
      <Hamburger onClick={toggleMenu}>
       {isOpen?<CloseIcon color="white" />:<MenuIcon  color="white"/>} 
      </Hamburger>
      <NavigationSection isOpen={isOpen}>
        <NavItem>
          <p><ChangeListIcon/>Company Listing</p>
          <p><PeopleBranchIcon/>Records</p>
          <p><UserBadgeIcon/>Student Data</p>
          <p><TaskIcon/>Student Assessments</p>
          <p><WechatOutlineIcon/>View Queries</p>
          <p><BarLineChartIcon/>Analytics</p>
        </NavItem>
        <Username>
          <p><AdminIcon />Username</p>
        </Username>
      </NavigationSection>
    </Wrapper>
  );
};

export default Dashboard;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;
const Wrapper = styled.div`
  width: 100vw;
  display: flex;
  color: white;
  position: relative;
  background-color: #af1111;
  height: 70px;
  position: fixed;

`;

const LogoSection = styled.div`
  margin-right: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    height: 50px;
    width: 150px;
  }
`;

const Hamburger = styled.div`
  display: none;
  font-size:2rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    width: 100%;
    font-size: 25px;
    flex-direction: row-reverse;
    margin-right: 10px;
  }
`;

const NavigationSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  background-color: #af1111;
  flex-direction: row;

  @media (max-width: 768px) {
    display: ${props => (props.isOpen ? "flex" : "none")};
    position: absolute;
    top: 80px;
    left: 0;
    right: 0;
    background-color: #af1111;
    z-index: 1;
    flex-direction: column-reverse;
    animation: ${fadeIn} 1s ease-in-out;
  }
`;

const NavItem = styled.div`
  display: flex;
  flex-direction: row;
  width: 90%;
  justify-content: center;
  align-items: center;

  p {
    margin: 15px;
    padding: 0px 36px 0px 30px;
    font-size: 16px;
    transition: 0.3s ease-in all;
    cursor: pointer;
    display: flex;
    .rs-icon{
        margin-right: 10px;
        font-size: 18px;
    }

    &:hover {
      transform: scale(0.9);
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: start;
    align-items: baseline;
    width: 100%;
    p {
      padding: 10px 0;
      display: flex;
        align-items: center;
        .rs-icon{
            margin-right: 10px;
            font-weight: bolder;
            font-size: 18px;
        }
      
    }
  }
`;

const Username = styled.div`
  width: 10%;
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    font-size: 16px;
    margin-left: 10px;
    transition: 0.3s ease-in all;
    cursor: pointer;
    display: flex;

    &:hover {
      transform: scale(0.9);
    }
  }

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    justify-content: start;
    align-items: baseline;
    width: 100%;
    margin-bottom: 20px;
    margin-top: 14px;

    p{
        display: flex;
        align-items: center;
        margin-left: 16px;
        .rs-icon{
            margin-right: 10px;
            font-weight: bolder;
            font-size: 18px;
        }
    }
  }
`;
