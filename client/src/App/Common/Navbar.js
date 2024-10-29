import React, { useEffect, useState } from "react";
import Nmims from "../../assets/Logo.png";
import AdminIcon from "@rsuite/icons/Admin";
import styled, { keyframes } from "styled-components";
import MenuIcon from '@rsuite/icons/Menu';
import CloseIcon from '@rsuite/icons/Close';
import { Link, useNavigate } from "react-router-dom";
import ExitIcon from '@rsuite/icons/Exit';
import { IconButton } from "rsuite";


const Navbar = ({Routes}) => {
  const [open, setopen] = useState(false);
  const [sessionData, setSessionData] = useState([]);
 const navigate = useNavigate()
  useEffect(() => {
    // Retrieve data from session storage
    const storedData = sessionStorage.getItem('user');
    console.log(storedData)
    if (storedData) {
      setSessionData(JSON.parse(storedData));
    }
  }, []);

  const toggleMenu = () => {
    setopen(!open);
  };

  const ClearSession = ()=>{
    sessionStorage.clear();
    navigate('/');
  }
  return (
    <Wrapper>
     
      <LogoSection style={{background:"white"}}>
      <Link to='/Dashboard'>
        <img src={Nmims} alt="Loading" />
        </Link>
      </LogoSection>
     
      <Hamburger onClick={toggleMenu}>
       {open?<CloseIcon color="white" />:<MenuIcon  color="white"/>} 
      </Hamburger>
      <NavigationSection open={open}>
        <NavItem>
          {Routes.map((route,key)=>{
           return <Link onClick={toggleMenu} to={route.to} key={key}><p >{route.icon}{route.txt}</p></Link>
          })}
        </NavItem>
        <Username onClick={ClearSession}>
          <p>{sessionData.email} <ExitIcon style={{fontWeight:"bolder", fontSize:"18px", marginLeft:"20px"}}/></p>
        </Username>
      </NavigationSection>
    </Wrapper>
  )
}

export default Navbar
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
  position: relative;
  background-color: #af1111;
  height: 70px;
  position: sticky;
  color: white;
  z-index: 1000;
  

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
  z-index: 1;
  @media (max-width: 768px) {
    display: ${props => (props.open ? "flex" : "none")};
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
  a{
    color: white;
    cursor: pointer;
    font-size: 16px;
    transition: 0.3s ease-in all;
    &:hover {
      transform: scale(0.9);
      text-decoration: none;
    }
  }
  p {
    margin: 15px;
    padding: 0px 4px 0px 15px;
    display: flex;
    .rs-icon{
        margin-right: 10px;
        font-size: 18px;
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
  width: 25%;
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    font-size: 15px;
    margin-left: 10px;
    transition: 0.3s ease-in all;
    cursor: pointer;
    display: flex;
    .rs-icon{
      margin-right: 10px;
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