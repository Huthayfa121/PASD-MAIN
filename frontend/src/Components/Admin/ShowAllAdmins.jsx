import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ShowAllAdmins.css';

const ShowAllAdmins = () => {
    const [admins, setAdmins] = useState([]);

    useEffect(() => {
        // Fetch all admins from the server
        axios.get('http://localhost:3001/getAdmins') // Adjust URL if needed
            .then(res => {
                setAdmins(res.data); // Save the fetched data in the state
            })
            .catch(err => {
                console.error("Error fetching admins:", err);
            });
    }, []); // Empty dependency array, meaning this effect runs once when the component mounts

    return (
        <div className='showAllAdmins'>
            <h1>All Admins</h1>
            <table className='adminTableContainer '>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Username</th>
                    </tr>
                </thead>
                <tbody>
                    {admins.length > 0 ? (
                        admins.map(admin => (
                            <tr key={admin._id}>
                                <td>{admin.first_name}</td>
                                <td>{admin.last_name}</td>
                                <td>{admin.email}</td>
                                <td>{admin.username}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No admins found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ShowAllAdmins;

