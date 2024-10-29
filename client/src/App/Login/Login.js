import React, { useContext, useState } from "react";
import styled from "styled-components";
import BACKGROUND_IMAGE from "../../assets/Background.png";
import NMIMS from "../../assets/Nmims.png";
import { Button, Checkbox, Input, InputGroup, Notification, toaster } from "rsuite";
import MemberIcon from "@rsuite/icons/Member";
import EyeCloseIcon from "@rsuite/icons/EyeClose";
import VisibleIcon from "@rsuite/icons/Visible";
import {  useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../App";
const Login = () => {
  const [hidden, setHidden] = useState(true);
  const [User, setUser] = useState("");
  const [Password, setPassword] = useState("")
 const history = useNavigate();
 const { dispatch } = useContext(UserContext);

  const Security = () => {
    setHidden(!hidden);
  };
  const keyDown = (ev) => {
    if (ev.key === 'Enter') {
      Onsubmit();
    }
  };
  
  const Onsubmit = () => {
    axios.post('/', {
      email: User,
      password: Password
    })
    .then((response) => {
      const data = response.data;
      
      if (data.error) {
        toaster.push(
          <Notification type="error" header="Error">
            {data.error}
          </Notification>,
          { placement: "topCenter", duration: 3000 }
        );
      } else {
        sessionStorage.setItem("jwt",data.token)
        sessionStorage.setItem("user",JSON.stringify(data.user))
        dispatch({ type: "USER", payload: data.user });
        toaster.push(
          <Notification type="success" header="Success">
            {data.user.message}
          </Notification>,
          { placement: "topCenter", duration: 3000 }
        );
        history("./Dashboard");
      }
    })
    .catch((error) => {
      toaster.push(
        <Notification type="error" header="Error">
{         error.response.data.error
}        </Notification>,
        { placement: "topCenter", duration: 3000 }
      );
    });
  };

  return (
    <Background>
      <Container>
        <Block1>
          <img src={NMIMS} alt="loading" />
        </Block1>
        <Block2>
          <InputGroup className="inputgroup">
            <InputGroup.Addon className="icon">
              {<MemberIcon />}
            </InputGroup.Addon>
            <Input type="text" value={User} onKeyDown={keyDown} onChange={(value)=>setUser(value)} placeholder="Username"/>
          </InputGroup>
          <InputGroup className="inputgroup">
            <InputGroup.Addon className="icon">
              {hidden ? <EyeCloseIcon /> : <VisibleIcon />}
            </InputGroup.Addon>
            <Input type={hidden ? "password" : "text"} onKeyDown={keyDown}  value={Password} onChange={(value)=>setPassword(value)} placeholder="Password" />
          </InputGroup>
          <Checkbox onChange={Security} color="red"><p onClick={Security}>Show Passoword</p></Checkbox>
          <div className="box">
            <Button color="red" onClick={Onsubmit} appearance="primary" size="lg">Login</Button>
          </div>
        </Block2>
      </Container>
    </Background>
  );
};

export default Login;

const Background = styled.div`
  width: 100%;
  background-image: url(${BACKGROUND_IMAGE});
  background-size: 100vw 100vh;
  background-repeat: no-repeat;
  object-fit: scale-down;
  z-index: 1;
  height: 100vh;
  box-shadow: inset 0 0 0 2000px rgba(0, 0, 120, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width:480px) {
    height: 100vh;
    width: 100vw;
  }
  @media (max-width:768px) {
    height: 100vh;
    width: 100vw;
  }
`;

const Container = styled.div`
  border: 2px solid white;
  width: 750px;
  height: 350px;
  border-radius: 10px;
  background-color: white;
  box-shadow: 5px 5px 10px 10px white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px;

  animation: fadeInpop 1s ease forwards;

  @keyframes fadeInpop {
    0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

  @media (max-width: 1024px) {
    max-width: 600px;
  }
  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    padding: 20px 10px;
  }

  @media (max-width: 480px) {
    width: 80%;
    padding: 15px 5px;
  }
`;

const Block1 = styled.div`
  height: 90%;
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
  img {
    width: 250px;
  }
  border-right: 2px solid red;
  
  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 2px solid red;
    padding-bottom: 20px;

    img {
      max-width: 250px;
    }
  }

  @media (max-width: 480px) {
    img {
      max-width: 200px;
    } 
    border: none;
  }
`;
const Block2 = styled.div`
  height: 70%;
  padding: 50px 0px 20px 20px;
  width: 50%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    padding: 10px 0;
  }
  @media (max-width: 480px) {
      justify-content: center;
      padding:20px;
      height: 80%;
      .icon {
        font-size: 18px;
      }
      button{
        margin-top: 10px;
        width: 120px;
      }
    }
    button{
        width: 160px;
    }
  .inputgroup {
    border: 2px solid red !important;
    height: 50px;
    margin-bottom: 20px;
    input {
        color: red;
      &::placeholder {
        color: red;
      }
    }
    .icon {
      color: red;
      font-size: 22px;
    }
  }
  .box{
    width: 100%;
    text-align: right;
  }
`;
