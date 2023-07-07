import logo from './logo.svg';
import './App.css';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from './pages/Home';
import Nav from './components/Nav';
import './styles/components.css'
import SignIn from './pages/SignIn';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import SingleMovie from './pages/SingleMovie';
import VideoPlayer from './pages/VideoPlayer';
import AllCards from './pages/AllCards';
import About from './pages/About';
import Search from './pages/Search';
import PayCard from './components/PayCard';
import Loader from './components/Loader';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './styles/styles';

function App() {

  return (
    <div className="">
      <ThemeProvider theme={theme}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <Router>
          <Nav />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/SignIn' element={<SignIn />} />
            <Route path='/SignUp' element={<SignUp />} />
            <Route path='/Profile' element={<Profile />} />
            <Route path='/About' element={<About />} />
            <Route path='/recently-watched' element={<AllCards path='recently-watched' />} />
            <Route path='/wishlist' element={<AllCards path='wishlist' />} />
            <Route path='/Search/:id' element={<Search />} />
            <Route path='/VideoPlay/:id' element={<VideoPlayer />} />
            <Route path='/Search' element={<Search />} />
            <Route path='/SingleMovie/:id' element={<SingleMovie />} />
          </Routes>
          <PayCard />
          <Loader />
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
