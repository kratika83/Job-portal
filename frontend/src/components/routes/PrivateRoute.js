import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { hideLoading, showLoading } from '../../redux/features/alertSlice';
import { setUser } from '../../redux/features/auth/authSlice';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const { user } = useSelector((state) => state.auth)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getUser = async () => {
        try {
            dispatch(showLoading());
            const { data } = await axios.post('/api/v1/user/', {
                token: localStorage.getItem('token')
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
            )
            console.log('private--');
            dispatch(hideLoading());
            if (data.success) {
                dispatch(setUser(data.data))
            } else {
                localStorage.clear();
                navigate('/login');
            }
        } catch (error) {
            console.error('Error during getUser:', error.response || error.message);
            localStorage.clear();
            dispatch(hideLoading())
        }
    };
    useEffect(() => {
        if (!user) {
            getUser()
        }
    });

    if (localStorage.getItem('token')) {
        return children;
    } else {
        return <Navigate to='/login' />
    }
}

export default PrivateRoute
