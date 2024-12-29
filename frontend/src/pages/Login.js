import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import InputForm from '../components/InputForm';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../redux/features/alertSlice';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.alerts)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(showLoading());
      const response = await axios.post('/api/v1/auth/login', { email, password });
      console.log(response, 'response--');
      const { data } = response;
      console.log(data, 'data--');


      if (data.success) {
        dispatch(hideLoading());
        localStorage.setItem('token', data.token)
        toast.success('Logged in successfully');
        navigate('/dashboard');
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error('Invalid credentials. Please try again!')
      console.log(error);
    }
  }

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className='form-container'>
          <form className='card p-2' onSubmit={handleSubmit}>
            <img src='/logo192.png' alt='logo' height={150} width={200} />
            <InputForm
              htmlFor="email"
              labelText={"Email"}
              type={"email"}
              name="email"
              value={email}
              handleChange={(e) => setEmail(e.target.value)}
            />
            <InputForm
              htmlFor="password"
              labelText={"Password"}
              type={"password"}
              name="password"
              value={password}
              handleChange={(e) => setPassword(e.target.value)}
            />
            <div className='d-flex justify-content-between'>
              <p>Not a User? <Link to='/register'>Register here!</Link></p>
              <button type="submit" className="btn btn-primary">Login</button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

export default Login
