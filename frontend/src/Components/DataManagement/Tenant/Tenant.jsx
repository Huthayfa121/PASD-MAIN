import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaEye, FaPlus } from "react-icons/fa";
import { BiSortAlt2 } from "react-icons/bi";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { GoPersonFill } from "react-icons/go";
import { useNavigate } from "react-router-dom";


const Tenants = () => {

  const navigate = useNavigate();
    const Back = () => {
          navigate('/')
      }
  const [tenants, setTenants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [buildings, setBuildings] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [addTenant, setAddTenant] = useState("");
  const [tenant_name, setTenantName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Make the API call to add a new tenant
    axios.post('http://localhost:3001/add-tenant', { tenant_name })
      .then((res) => {
        console.log(res);
        alert("Tenant added successfully");
        setAddTenant(false);
      })
      .catch((err) => {
        console.error("Error adding tenant:", err);
        alert("Failed to add tenant");
      });
  };

  // Fetch tenants on component mount
  useEffect(() => {
    axios
      .get("http://localhost:3001/tenants") // Adjust URL if needed
      .then((res) => {
        setTenants(res.data);
      })
      .catch((err) => {
        console.error("Error fetching tenants:", err);
      });
  }, []);

  const handleSort = (columnName) => {
    const direction =
      sortConfig.key === columnName && sortConfig.direction === "asc"
        ? "desc"
        : "asc";
    setSortConfig({ key: columnName, direction });

    const sortedData = [...tenants].sort((a, b) => {
      if (a[columnName] < b[columnName]) return direction === "asc" ? -1 : 1;
      if (a[columnName] > b[columnName]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setTenants(sortedData);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (id) => {
    const newName = prompt("Enter new name:");
    if (newName) {
      axios
        .put(`http://localhost:3001/tenants/${id}`, { name: newName })
        .then(() => {
          alert("Tenant updated successfully");
          setTenants((prev) =>
            prev.map((tenant) =>
              tenant._id === id ? { ...tenant, name: newName } : tenant
            )
          );
        })
        .catch((err) => {
          console.error("Error updating tenant:", err);
          alert("Failed to update tenant");
        });
    }
  };

  const handleBuildingSearch = (id) => {
    setBuildings([]);
    setSelectedTenant(tenants.find((tenant) => tenant._id === id));

    axios
      .get(`http://localhost:3001/tenants/${id}/buildings`)
      .then((res) => {
        setBuildings(res.data); // Assuming res.data contains building details
        setFormVisible(true);
      })
      .catch((err) => {
        console.error("Error fetching buildings:", err);
        alert("Failed to fetch buildings.");
      });
  };

  const filteredTenants = tenants.filter((tenant) =>
    Object.values(tenant)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTenants = filteredTenants.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (addTenant) {
    return (
      <div className='AddAdminHome'>
        <div className="AddAdminWrapper">
          <div className="AddAdminFormBox">
            <h2 className="AddAdminTitle">Add New Tenant</h2>
            <form onSubmit={handleSubmit}>
              <div className="AddAdminInputBox">
                <input
                  type="text"
                  name="tenantName"
                  onChange={(e) => setTenantName(e.target.value)}
                  required
                />
                <label>Tenant Name</label>
                <GoPersonFill className='icon' />
              </div>
              <button type="submit" className="AddAdminBtn">Add Tenant</button>
            </form>
            <button className="AddAdminBtn" style={{width: "100px"}} onClick={Back}>Home</button>
          </div>
        </div>
      </div>
    );
  } else if (!addTenant) {
    return (
      <div className="table-container">
        {formVisible ? (
          <>
            <h1>Buildings Related to Tenant: {selectedTenant?.tenantName}</h1>
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
            <button className="submit-button" onClick={() => setFormVisible(false)}> Back to Tenants </button>
          </>
        ) : (
          <>
            <h1>Tenants</h1>
            <div className="controls">
              <input type="text" className="form-control search-bar" placeholder="Search..." value={searchTerm} onChange={handleSearch} />
              <button className="btn btn-primary add-button" onClick={() => { setAddTenant(true); }}> <FaPlus /></button>
            </div>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>
                    <AiOutlineFieldNumber />
                  </th>
                  <th onClick={() => handleSort("tenant_name")}>
                    Tenant Name <BiSortAlt2 />
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTenants.length > 0 ? (
                  currentTenants.map((tenant, index) => (
                    <tr key={tenant._id}>
                      <td>{indexOfFirstItem + index + 1}</td>
                      <td>{tenant.tenant_name}</td>
                      <td>
                        <button
                          className="edit-button"
                          onClick={() => handleEdit(tenant._id)}
                        >
                          <FaEdit />
                        </button>
                        <button className="view-button" onClick={() => handleBuildingSearch(tenant._id)}> <FaEye /> View Buildings</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No tenants found.</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="pagination">
              {Array.from(
                { length: Math.ceil(filteredTenants.length / itemsPerPage) },
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

export default Tenants;
