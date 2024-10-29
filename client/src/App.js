import {  Route, Routes, useNavigate } from "react-router";
import "./App.css";
import Login from "./App/Login/Login";
import ErrorPage from "./ErrorPage";
import Dashboard from "./App/Home/Dashboard";
import { createContext, useContext, useEffect, useReducer } from "react";
import { initialState, reducer } from "./AuthProvider/AuthProvider";

export const UserContext = createContext();
const Routing = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(UserContext);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER",payload:user});
      navigate("./Dashboard");
    } else {
      navigate("./");
    }
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Dashboard/*" element={<Dashboard />} />
    </Routes>
  );
};
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <Routing />
    </UserContext.Provider>
  );
}

export default App;
