import React, { useState } from 'react';
import Dashboard from '../Dashboard/Dashboard';
import axios from 'axios';
import './Login.css';
import { FaUserLock } from "react-icons/fa6";
import { MdOutlinePassword } from "react-icons/md";
import { Link } from 'react-router-dom';

const Login = () => {

  
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [isLogin, setIsLogin] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:3001/login', { username, password })
            .then(res => {
                console.log(res)
                if (res.data === "Success") {
                    localStorage.setItem('adminUsername', username);
                    setIsLogin(true)
                }
            })
            .catch(err => console.log(err))
        
    }

    return (
        <div>
            {!isLogin && (
                <div className='LoginHome'>
            <div className="wrapperLogin">
                <span className="rotate-bg"></span>
                <span className="rotate-bg2"></span>
                <div className="form-box1 login">
                    <h2 className="title">Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-box">
                            <input type="text" name='username' onChange={(e) => setUsername(e.target.value)} required />
                            <label>Username</label>
                            <FaUserLock className='icon'/>
                        </div>

                        <div className="input-box ">
                            <input type="password" name='password' onChange={(e) => setPassword(e.target.value)} required />
                            <label>Password</label>
                            <MdOutlinePassword className='icon'/>
                        </div>

                        <div className="linkTxt">
                            <p><Link to='/Dashboard' className="register-link">Forgot Password?</Link></p>
                        </div>

                      <button type="submit">Login</button>
                    </form>
                </div>

                <div className="info-text login">
                    <h2>Welcome Back</h2>
                </div>
            </div>
            </div>
            )}
            {isLogin && <Dashboard />}
        </div>
        
    );
};

export default Login;
