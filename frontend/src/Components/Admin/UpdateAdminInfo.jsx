import React, { useState } from 'react';
import './UpdateAdminInfo.css';
import axios from 'axios';
import { SlEnvolope } from "react-icons/sl";
import { GoPersonFill } from "react-icons/go";
import { FaUserLock } from "react-icons/fa6";
import { MdOutlinePassword } from "react-icons/md";

const UpdateAdminInfo = () => {
    const [searchUsername, setSearchUsername] = useState(''); // For searching admin by username
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isAdminFound, setIsAdminFound] = useState(false); // To check if admin exists
    const [isSearchHidden, setIsSearchHidden] = useState(false); // Hide search bar after successful search
    const [formVisible, setFormVisible] = useState(true);

    // Handle search for admin
    const handleSearch = () => {
        axios.get(`http://localhost:3001/admin/${searchUsername}`)
            .then((res) => {
                if (res.data) {
                    setFirstName(res.data.first_name);
                    setLastName(res.data.last_name);
                    setEmail(res.data.email);
                    setUsername(res.data.username);
                    setPassword(res.data.password);
                    setIsAdminFound(true);
                    setIsSearchHidden(true); // Hide search bar
                    
                } else {
                    alert("Admin not found!");
                    setIsAdminFound(false);
                }
            })
            .catch((err) => {
                alert("Admin not found!");
                console.error(err)
            });
    };

    // Handle update admin
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:3001/admin/${username}`, { first_name, last_name, email, username, password })
            .then((res) => {
                console.log(res);
                alert("Admin updated successfully!");
                setFormVisible(false);
            })
            .catch((err) => console.error(err));
        
    };

    if (!formVisible) {
        return 
    }

    return (
        <div className="UpdateAdminHome">
            <div className="UpdateAdminWrapper">
                <div className="UpdateAdminFormBox">
                    <h2 className="UpdateAdminTitle">Update Admin Information</h2>
 
                    {/* Search Admin by Username */}
                    {!isSearchHidden && (
                        <div>
                        <div className="UpdateAdminInputBox">
                            <input
                                type="text"
                                name="searchUsername"
                                value={searchUsername}
                                onChange={(e) => setSearchUsername(e.target.value)}
                                required
                            />
                                <label>Search by Username</label>
                                <FaUserLock className="icon" />
                            </div>
                            <button onClick={handleSearch} className="UpdateAdminBtn" type="button">
                                Search
                            </button>
                    </div>
                        
                    )}
                    

                    {isAdminFound && (
                        <form onSubmit={handleSubmit}>
                            <div className="UpdateAdminInputBox">
                                <input
                                    type="text"
                                    name="firstName"
                                    value={first_name}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                                <label>First Name</label>
                                <GoPersonFill className="icon" />
                            </div>

                            <div className="UpdateAdminInputBox">
                                <input
                                    type="text"
                                    name="lastName"
                                    value={last_name}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                                <label>Last Name</label>
                                <GoPersonFill className="icon" />
                            </div>

                            <div className="UpdateAdminInputBox">
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <label>Email</label>
                                <SlEnvolope className="icon" />
                            </div>

                            <div className="UpdateAdminInputBox">
                                <input
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <label>Password</label>
                                <MdOutlinePassword className="icon" />
                            </div>

                            <button type="submit" className="UpdateAdminBtn">
                                Update
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpdateAdminInfo;
