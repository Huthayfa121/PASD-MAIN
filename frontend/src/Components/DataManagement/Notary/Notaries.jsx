import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaEye, FaPlus } from "react-icons/fa";
import { BiSortAlt2 } from "react-icons/bi";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { GoPersonFill } from "react-icons/go";
import { useNavigate } from "react-router-dom";



const Notaries = () => {
  const navigate = useNavigate();
    const Back = () => {
          navigate('/')
  }
  
  const [notaries, setNotaries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [buildings, setBuildings] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedNotary, setSelectedNotary] = useState(null);
  const [AddNotary, SetAddNotary] = useState("")
  const [notary_name, setNotary_name] = useState("");
  
   const handleSubmit = (e) => {
    e.preventDefault();

    // Make the API call to add a new notary
    axios.post('http://localhost:3001/add-notary', { notary_name })
      .then((res) => {
        console.log(res);
          alert("Notary added successfully");
          SetAddNotary(false);
          
      })
      .catch((err) => {
        console.error("Error adding notary:", err);
        alert("Failed to add notary");
      });
  };

  // Fetch notaries
  useEffect(() => {
    axios
      .get("http://localhost:3001/notaries")
      .then((res) => {
        setNotaries(res.data);
      })
      .catch((err) => {
        console.error("Error fetching Notaries:", err);
      });
  }, []);

  const handleSort = (columnName) => {
    const direction =
      sortConfig.key === columnName && sortConfig.direction === "asc"
        ? "desc"
        : "asc";
    setSortConfig({ key: columnName, direction });

    const sortedData = [...notaries].sort((a, b) => {
      if (a[columnName] < b[columnName]) return direction === "asc" ? -1 : 1;
      if (a[columnName] > b[columnName]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setNotaries(sortedData);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (id) => {
    const newName = prompt("Enter new name:");
    if (newName) {
      axios
        .put(`http://localhost:3001/notaries/${id}`, { name: newName })
        .then(() => {
          alert("Notary updated successfully");
          setNotaries((prev) =>
            prev.map((notary) =>
              notary._id === id ? { ...notary, name: newName } : notary
            )
          );
        })
        .catch((err) => {
          console.error("Error updating notary:", err);
          alert("Failed to update notary");
        });
    }
  };

  const handleBuildingSearch = (id) => {
    setBuildings([]);
    setSelectedNotary(notaries.find((notary) => notary._id === id));

    axios
      .get(`http://localhost:3001/notaries/${id}/buildings`)
      .then((res) => {
        setBuildings(res.data); // Assuming res.data contains building details
        setFormVisible(true);
      })
      .catch((err) => {
        console.error("Error fetching buildings:", err);
        alert("Failed to fetch buildings.");
      });
  };

  const filteredNotaries = notaries.filter((notary) =>
    Object.values(notary)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNotaries = filteredNotaries.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  if (AddNotary) {
     return (
        <div className='AddAdminHome'>
          <div className="AddAdminWrapper">
            <div className="AddAdminFormBox">
              <h2 className="AddAdminTitle">Add New Notary</h2>
              <form onSubmit={handleSubmit}>
                <div className="AddAdminInputBox">
                  <input
                    type="text"
                    name="notary_name"
                    onChange={(e) => setNotary_name(e.target.value)}
                    required
                  />
                  <label>Notary Name</label>
                  <GoPersonFill className='icon' />
                </div>
                <button type="submit" className="AddAdminBtn">Add Notary</button>
             </form>
             <button className="AddAdminBtn" style={{width: "100px"}} onClick={Back}>Home</button>
            </div>
          </div>
        </div>
    );
    
  }
  else if (!AddNotary) {
    return (
    <div className="table-container">
      {formVisible ? (
        <>
          <h1>Buildings Related to Notary: {selectedNotary?.notary_name}</h1>
          <table className="custom-table">
            <thead>
              <tr>
                <th>
                  <AiOutlineFieldNumber />
                </th>
                <th>
                  Building Name <BiSortAlt2 />
                </th>
              </tr>
            </thead>
            <tbody>
              {buildings.length > 0 ? (
                buildings.map((building, index) => (
                  <tr key={building.building_id}>
                    <td>{index + 1}</td>
                    <td>{building.building_name}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">No buildings found.</td>
                </tr>
              )}
            </tbody>
          </table>
          <button className="submit-button " onClick={() => setFormVisible(false)} > Back to Notaries </button>
        </>
        ) : (
        <>
          <h1>Notaries</h1>
          <div className="controls">
            <input type="text" className="form-control search-bar" placeholder="Search..." value={searchTerm} onChange={handleSearch} />
            <button className="btn btn-primary add-button" onClick={() => {SetAddNotary(true)}}> <FaPlus /></button>
          </div>
          <table className="custom-table">
            <thead>
              <tr>
                <th>
                  <AiOutlineFieldNumber />
                </th>
                <th onClick={() => handleSort("notary_name")}>
                  Notary Name <BiSortAlt2 />
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentNotaries.length > 0 ? (
                currentNotaries.map((notary, index) => (
                  <tr key={notary._id}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>{notary.notary_name}</td>
                    <td>
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(notary._id)}
                      >
                        <FaEdit />
                      </button>
                      <button className="view-button"  onClick={() => handleBuildingSearch(notary._id)} > <FaEye /> View Buildings</button>
                    </td>
                  </tr>
                ))
                ) : (
                <tr>
                  <td colSpan="3">No notaries found.</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="pagination">
            {Array.from(
              { length: Math.ceil(filteredNotaries.length / itemsPerPage) },
              (_, i) => (
                <button
                  key={i}
                  className={`page-button ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </button>
              )
            )}
          </div>
        </>
        )}
        <button className="AddAdminBtn" style={{width: "100px"}} onClick={Back}>Home</button>
    </div>
  );
  }
};

export default Notaries;
