import { Route, Routes } from 'react-router-dom';
import HomePage from "./pages/homepage";
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import { ToastContainer } from 'react-toastify';
import PrivateRoute from './components/routes/PrivateRoute';
import PublicRoute from './components/routes/PublicRoute';
//import 'react-toastify/dist/ReactTostify.css';

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path='/' element={
          //<PublicRoute>
          <HomePage />
          //</PublicRoute>
        }
        />
        <Route path='/register' element={
          //<PublicRoute>
          <Register />
          //</PublicRoute>
        }
        />
        <Route
          path='/login'
          element={
            //<PublicRoute>
            <Login />
            //</PublicRoute>
          }
        />
        <Route
          path='/dashboard'
          element={
            //<PrivateRoute>
            <Dashboard />
            //</PrivateRoute>
          }
        />
        <Route path='*' element={
          //<PublicRoute>
          <NotFound />
          //</PublicRoute>
        }
        />
      </Routes>
    </>
  );
}

export default App;
