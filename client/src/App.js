import { Route, Routes } from 'react-router';
import './App.css';
import Login from './App/Login/Login';
import ErrorPage from './ErrorPage';
import Dashboard from './App/Home/Dashboard';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Login/>}/> 
      <Route path='*' element={<ErrorPage/>}/>
      <Route path='/Dashboard' element={<Dashboard/>}/>
    </Routes>
  );
}

export default App;

