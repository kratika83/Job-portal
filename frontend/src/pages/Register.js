import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputForm from '../components/InputForm';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import { showLoading, hideLoading } from './../redux/features/alertSlice';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");

  const { loading } = useSelector((state) => state.alerts)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!firstName || !lastName || !email || !password) {
        return toast.error('Please provide all fields')
      }
      dispatch(showLoading());
      const { data } = await axios.post('/api/v1/auth/register', { firstName, lastName, email, password })
      dispatch(hideLoading());
      if (data.success) {
        toast.success('Registered successfully');
        navigate('/login');
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error('Invalid Form Details. Please try again!')
      console.log(error);
    }
  }

  return (
    <>
      {loading ? (<Spinner />) :
        (
          <div className='form-container'>
            <form className='card p-2' onSubmit={handleSubmit}>
              <img src='/logo192.png' alt='logo' height={100} width={200} />
              <InputForm
                htmlFor="firstName"
                labelText={"First Name"}
                type={"text"}
                name="firstName"
                value={firstName}
                handleChange={(e) => setFirstName(e.target.value)}
              />
              <InputForm
                htmlFor="lastName"
                labelText={"Last Name"}
                type={"text"}
                name="lastName"
                value={lastName}
                handleChange={(e) => setLastName(e.target.value)}
              />
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
              <InputForm
                htmlFor="location"
                labelText={"Location"}
                type={"text"}
                name={"location"}
                value={location}
                handleChange={(e) => setLocation(e.target.value)}
              />
              <div className='d-flex justify-content-between'>
                <p>Already Registered <Link to='/login'>Login</Link></p>
                <button type="submit" className="btn btn-primary">Register</button>
              </div>
            </form>
          </div>
        )
      }
    </>
  )
}

export default Register;
