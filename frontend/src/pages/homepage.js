import { Link } from 'react-router-dom';
import jobPortal from '../images/job_portal.jpg';
import '../styles/HomePage.css';

const HomePage = () => {
    return <>
        <img id='myImage' src={jobPortal} alt="Job portal" height='600' width='1350' />
        <div className='content'>
            <div className='card w-25'>
                <img src='/assets/images/logo/job_logo.jpg' alt='logo' />
                <hr />
                <div className='card-body' style={{ marginTop: "-60px" }}>
                    <h5 className='card-title'>India's no. #1 Career Platform</h5>
                    <p className='card-text'>
                        Search and manage your jobs with ease. Free and open source job potal application
                    </p>
                    <div className='d-flex justify-content-between mt-5'>
                        <p>Not a user? Register <Link to='/register'>Here!</Link></p>
                        <p><Link to='/login' className='myBtn'>Login</Link></p>
                    </div>
                </div>
            </div>
        </div>
    </>
};

export default HomePage;