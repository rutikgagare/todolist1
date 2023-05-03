import classes from './Login.module.css';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { loginActions } from '../../store/loginSlice';
import cross from '../../Images/cross.png';

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();

    const registrationHandler = async (event) => {
        event.preventDefault();
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);

            dispatch(loginActions.setLogout());
            navigate('/login');

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    const goToHomeHandler = () => {
        navigate('/');
    }

    return (
        <div className={classes.main}>
            <div className={classes.loginForm}>
                <div className={classes.img} onClick={goToHomeHandler}>
                    <img src={cross} alt="Not Found" />
                </div>
                <h2>Register</h2>
                <form onSubmit={registrationHandler} >
                    <input type="email" placeholder='Enter email' onChange={(e) => { setEmail(e.target.value) }} />
                    <input type="password" placeholder='Enter password' onChange={(e) => { setPassword(e.target.value) }} />

                    <button type="submit">Register</button>
                    <span><Link to="/login">Already have a account?</Link></span>
                </form>
            </div>
        </div>
    );
}
export default Register;