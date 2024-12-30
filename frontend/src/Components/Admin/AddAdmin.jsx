import React, { useState } from 'react';
import './AddAdmin.css';
import axios from 'axios';
import { SlEnvolope } from "react-icons/sl";
import { GoPersonFill } from "react-icons/go";
import { FaUserLock } from "react-icons/fa6";
import { MdOutlinePassword } from "react-icons/md";

const AddAdmin = () => {
    const [first_name, setFirstName] = useState() 
    const [last_name, setLastName] = useState()
    const [email, setEmail] = useState()
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [formVisible, setFormVisible] = useState(true);

    const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form from refreshing the page

    // Make the API call to add a new admin
        axios.post('http://localhost:3001/addAdmin', { first_name, last_name, email, username, password })
            .then(res => {
                console.log(res);
                alert("Admin Inserted Successfully");
                setFormVisible(false);
            })
            .catch(err => {
                console.error("Error inserting admin:", err);
                
                // Check if the error has a response (the request reached the server)
                if (err.response) {
                    // Check for specific error status codes
                    if (err.response.status === 409) {
                        alert("Admin with this email or username already exists.");
                    } else if (err.response.status === 400) {
                        alert("Invalid input. Please ensure all fields are filled correctly.");
                    } else {
                        alert("Error inserting admin. Please try again.");
                    }
                } else {
                    // Handle network errors or if the request didn't reach the server
                    alert("Network error. Please check your connection.");
                }
            });
    };

    if (!formVisible) {
        return
    }

    return (
        <div className='AddAdminHome'>
            <div className="AddAdminWrapper">

                <div className="AddAdminFormBox">
                    <h2 className="AddAdminTitle">Add New Admin</h2>
                    <form onSubmit={handleSubmit}>

                         <div className="AddAdminInputBox">
                            <input type="text" name='first_name' onChange={(e) => setFirstName(e.target.value)} required />
                            <label>First Name</label>
                            <GoPersonFill  className='icon'/>
                        </div>

                         <div className="AddAdminInputBox">
                            <input type="text" name='last_name' onChange={(e) => setLastName(e.target.value)} required />
                            <label>Last Name</label>
                            <GoPersonFill  className='icon'/>
                        </div>

                         <div className="AddAdminInputBox">
                            <input type="email" name='email' onChange={(e) => setEmail(e.target.value)} required />
                            <label>Email</label>
                            <SlEnvolope className='icon'/>
                        </div>

                        <div className="AddAdminInputBox">
                            <input type="text" name='username' onChange={(e) => setUsername(e.target.value)} required />
                            <label>Username</label>
                            <FaUserLock className='icon'/>
                        </div>

                        <div className="AddAdminInputBox">
                            <input type="password" name='password' onChange={(e) => setPassword(e.target.value)} required />
                            <label>Password</label>
                            <MdOutlinePassword className='icon'/>
                        </div>

                        <button type="submit" className="AddAdminBtn">Add Admin</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddAdmin;
