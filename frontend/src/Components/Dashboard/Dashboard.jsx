import React, { useState } from 'react';
import './Dashboard.css';
import { Link } from 'react-router-dom';
import AddAdminForm from '../Admin/AddAdmin';
import UpdateAdminForm from '../Admin/UpdateAdminInfo';
import ShowAdmins from '../Admin/ShowAllAdmins';
import Notaries from '../DataManagement/Notary/Notaries'
import Owners from '../DataManagement/Owners/Owners';
import ShowBuilding from '../DataManagement/Buildings/ShowBuildings';
import Architects from '../DataManagement/Architects/Architects';

function Dashboard() {
  
    const [clicked, setClicked] = useState(false);
    const [adminDropdown, setAdminDropdown] = useState(false);  // State for Admin dropdown
    const [dataDropdown, setDataDropdown] = useState(false);    // State for Data dropdown
    const [showAddAdmin, setshowAddAdmin] = useState(false); 
    const [showUpdateAdmin, setshowUpdateAdmin] = useState(false);
    const [ShowAllAdmins, setShowAllAdmins] = useState(false);
    const [ShowNotaries, setShowNotaries] = useState(false);
    const [ShowOwners, setShowOwners] = useState(false);
    const [ShowBuildings, setShowBuildings] = useState(false);
    const [ShowArchitects, setShowArchitects] = useState(false);

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
        setShowNotaries(false)
        setShowOwners(false)
        setShowBuildings(false)
        setShowArchitects(false)
        
    }

    const updateAdmin = () => {
        setshowUpdateAdmin(true)
        setshowAddAdmin(false)
        setShowAllAdmins(false)
        setShowNotaries(false)
        setShowOwners(false)
        setShowBuildings(false)
        setShowArchitects(false)
    }

    const showAllAdmins = () => {
        setShowAllAdmins(true)
        setshowUpdateAdmin(false)
        setshowAddAdmin(false)
        setShowNotaries(false)
        setShowOwners(false)
        setShowBuildings(false)
        setShowArchitects(false)
    }
    const ShowNotarie = () => {
        setShowNotaries(true)
        setShowAllAdmins(false)
        setshowUpdateAdmin(false)
        setshowAddAdmin(false)
        setShowOwners(false)
        setShowBuildings(false)
        setShowArchitects(false)
    }

    const ShowAllOwners = () => {
        setShowOwners(true)
        setShowNotaries(false)
        setShowAllAdmins(false)
        setshowUpdateAdmin(false)
        setshowAddAdmin(false)
        setShowBuildings(false)
        setShowArchitects(false)
    }
    
    const ShowAllArchitects = () => {
        setShowOwners(false)
        setShowNotaries(false)
        setShowAllAdmins(false)
        setshowUpdateAdmin(false)
        setshowAddAdmin(false)
        setShowBuildings(false)
        setShowArchitects(true)
    }

    const ShowAllBuildings = () => {
        setShowOwners(false)
        setShowNotaries(false)
        setShowAllAdmins(false)
        setshowUpdateAdmin(false)
        setshowAddAdmin(false)
        setShowBuildings(true)
        setShowArchitects(false)
    }

    const HideAll = () => {
        setShowAllAdmins(false)
        setshowUpdateAdmin(false)
        setshowAddAdmin(false)
        setShowNotaries(false)
        setShowOwners(false)
        setShowBuildings(false)
        setShowArchitects(false)
    }

    return (
       <div className='home'>
            <nav className='NavBarItems'>
                <div>
                    <h2 className='h2Dashboard'>PASD Admin Dashboard</h2>
                </div>

                <div className='menu-icons' onClick={handleClick}>
                    <i className={clicked ? "fas fa-times" : "fas fa-bars"}></i>
                </div>

                <ul className={clicked ? "nav-menu active" : "nav-menu"}>
                    <li>
                        <Link to='/' className='nav-Links' onClick={HideAll}>
                            <i className='fa-solid fa-home'></i>Home
                        </Link>
                    </li>

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
                                    ShowAllArchitects();
                                    handleSelection("Architects");
                                }}>
                                    <a className="nav-Links">Architects</a>
                                </li>
                                <li>
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
                                <li>
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
            {ShowNotaries && <Notaries />}
            {ShowOwners && <Owners />}
            {ShowBuildings && <ShowBuilding />}
            {ShowArchitects && <Architects />}
        </div>
    );
}

export default Dashboard;
