import { Route, Routes } from 'react-router';
import './App.css';
import Login from './App/Login/Login';
import ErrorPage from './ErrorPage';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Login/>}/> 
      <Route path='*' element={<ErrorPage/>}/>
    </Routes>
  );
}

export default App;

