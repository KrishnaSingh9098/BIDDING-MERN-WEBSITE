import 'react'
import {BrowserRouter as Router , Routes ,Route} from "react-router-dom"
import SideDrawer from './layout/SideDrawer'
import Home from './pages/Home'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignUp from './pages/SignUp';
// import Login from './pages/Login';

const App = () => {
  return <Router>
    <SideDrawer/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/Sign-up' element={<SignUp/>}/>
      {/* <Route path="/login" element={<Login />} /> */}
    </Routes>
    <ToastContainer position='top-right'/>
  </Router>
}

export default App