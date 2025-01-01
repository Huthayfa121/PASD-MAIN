import React, { useState } from 'react';
import './Dashboard.css';
import { Link, useNavigate } from 'react-router-dom';
import AddAdminForm from '../Admin/AddAdmin';
import UpdateAdminForm from '../Admin/UpdateAdminInfo';
import ShowAdmins from '../Admin/ShowAllAdmins';



function Dashboard() {
  
    const [clicked, setClicked] = useState(false);
    const [adminDropdown, setAdminDropdown] = useState(false);  // State for Admin dropdown
    const [dataDropdown, setDataDropdown] = useState(false);    // State for Data dropdown
    const [showAddAdmin, setshowAddAdmin] = useState(false); 
    const [showUpdateAdmin, setshowUpdateAdmin] = useState(false);
    const [ShowAllAdmins, setShowAllAdmins] = useState(false);

    const navigate = useNavigate();

    // Get the logged-in admin's username from localStorage
    const username = localStorage.getItem('adminUsername') || '';
    
    const handleSelection = (selection) => {
    // Save the selection in local storage
    localStorage.setItem("selectedTable", selection);
    console.log(`Saved "${selection}" to local storage`);
    };

    const isAdminAllowed = username.toUpperCase().startsWith('H');

    const handleClick = () => {
        setClicked(!clicked);
    };

    const toggleAdminDropdown = () => {
        setAdminDropdown(true);
    };

    const toggleDataDropdown = () => {
        setDataDropdown(true);
    };

    const AddAdmin = () => {
        setshowAddAdmin(true)
        setshowUpdateAdmin(false)
        setShowAllAdmins(false)
  
        
    }

    const updateAdmin = () => {
        setshowUpdateAdmin(true)
        setshowAddAdmin(false)
        setShowAllAdmins(false)

    }

    const showAllAdmins = () => {
        setShowAllAdmins(true)
        setshowUpdateAdmin(false)
        setshowAddAdmin(false)

    }
    const ShowNotarie = () => {
       navigate('/Notaries')
    }

    const ShowAllOwners = () => {
        navigate('/Owners')
    }
    
    const ShowAllArchitects = () => {
        navigate('/Architects')
    }

    const ShowAllBuildings = () => {
        navigate('/ShowBuildings')
    }

    const ShowAllCities = () => {
        navigate('/Cities')
    }

    const ShowAllTenant = () => {
       navigate('/Tenants')
    }

    const ShowGallery = () => {
        navigate('/ImageSlider')
    }


    const HideAll = () => {
        setShowAllAdmins(false)
        setshowUpdateAdmin(false)
        setshowAddAdmin(false)
    }

    return (
       <div className='home'>
            <nav className='NavBarItems'>
                <div className="header-container" style={{ display: "flex", alignItems: "center" }}>
                    <img src='./palestine.png' style={{ width: "45px", height: "45px", marginRight: "10px" }} alt="Palestine" />
                    <h2 className='h2Dashboard'>PASD Admin Dashboard</h2>
                </div>



                <div className='menu-icons' onClick={handleClick}>
                    <i className={clicked ? "fas fa-times" : "fas fa-bars"}></i>
                </div>

                <ul className={clicked ? "nav-menu active" : "nav-menu"}>
                    {/* Conditionally render Admin Management if allowed */}
                    {isAdminAllowed && (
                        <li className="nav-item">
                            <a className='nav-Links' onClick={toggleAdminDropdown}>
                                <i className='fa-solid fa-users'></i>Admin Management
                            </a>
                            {adminDropdown && (
                                <ul className="dropdown">
                                    <li onClick={AddAdmin}>
                                        <a className="nav-Links">Add New Admin</a>
                                    </li>
                                    <li onClick={updateAdmin}>
                                        <a className="nav-Links">Update Admin Information</a>
                                    </li>
                                    <li onClick={showAllAdmins}>
                                        <a className="nav-Links">View All Admins</a>
                                    </li>
                                </ul>
                            )}
                        </li>
                    )}

                    {/* Data Management with Dropdown */}
                    <li className="nav-item">
                        <a className='nav-Links' onClick={toggleDataDropdown}>
                            <i className='fa-solid fa-database'></i>Data Management
                        </a>
                        {dataDropdown && (
                            <ul className="dropdown">
                                <li onClick={() => {
                                    ShowAllBuildings();
                                    handleSelection("building");
                                }}>
                                    <a className="nav-Links">Buildings</a>
                                </li>

                                <li onClick={() => {
                                    ShowGallery();
                                }}>
                                    <a className="nav-Links">Buildings Image Gallery</a>
                                </li>
                                
                                <li onClick={() => {
                                    ShowAllArchitects();
                                    handleSelection("Architects");
                                }}>
                                    <a className="nav-Links">Architects</a>
                                </li>
                                <li onClick={() => {
                                    ShowAllTenant();
                                    handleSelection("owners");
                                }}>
                                    <a className="nav-Links">Tenant</a>
                                </li>
                                <li onClick={() => {
                                    ShowAllOwners();
                                    handleSelection("owners");
                                }}>
                                    <a className="nav-Links">Owners</a>
                                </li>
                                <li onClick={() => {
                                    ShowNotarie();
                                    handleSelection("notaries");
                                }}>
                                    <a className="nav-Links">Notaries</a>
                                </li>
                                <li onClick={() => {
                                    ShowAllCities();
                                    handleSelection("cities");
                                }}>
                                    <a className="nav-Links">Cities</a>
                                </li>

                            </ul>
                        )}
                    </li>

                     <li>
                        <Link to='/AddCitie' className='nav-Links'>
                            <i className='fa fa-sign-out'></i>Logout
                        </Link>
                    </li>

                </ul>
            </nav>
            {showAddAdmin && <AddAdminForm />}
            {showUpdateAdmin && <UpdateAdminForm />}
            {ShowAllAdmins && <ShowAdmins />}
        </div>
    );
}

export default Dashboard;
