import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaPlus, FaEye } from "react-icons/fa";
import { BiSortAlt2 } from "react-icons/bi";
import { AiOutlineFieldNumber } from "react-icons/ai";
import AddBuildings from "./AddBuildings";
import { useNavigate } from "react-router-dom";

const ShowBuildings = () => {

  const navigate = useNavigate();
  const Back = () => {
        navigate('/')
    }

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [buildings, setBuildings] = useState([]);
  const [showAddBuildings, setShowAddBuildings] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [cities, setCities] = useState([]);
  const [status, setStatus] = useState([]);
  const [usage, setUsage] = useState([]);
  const [formVisible, setFormVisible] = useState(1); // 1: Buildings, 2: Status, 3: Usage
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  const showAllBuildings = () => {
    setShowAddBuildings(true);
  };

  const handleStatusSearch = (id) => {
    setStatus([]);
    setSelectedBuilding(buildings.find((building) => building._id === id));

    axios
      .get(`http://localhost:3001/buildings/${id}/status`)
      .then((res) => {
        setStatus(res.data);
        setFormVisible(2);
      })
      .catch((err) => {
        console.error("Error fetching status:", err);
        alert("Failed to fetch status.");
      });
  };

   const handleUsageSearch = (id) => {
    setUsage([]);
    setSelectedBuilding(buildings.find((building) => building._id === id));

    axios
      .get(`http://localhost:3001/buildings/${id}/usage`)
      .then((res) => {
        setUsage(res.data);
        setFormVisible(3); // Show usage view
      })
      .catch((err) => {
        console.error("Error fetching usage:", err);
        alert("Failed to fetch usage.");
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/get-cities")
      .then((res) => {
        setCities(res.data);
      })
      .catch((err) => console.error("Error fetching cities:", err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3001/get-addresses")
      .then((res) => {
        setAddresses(res.data);
      })
      .catch((err) => console.error("Error fetching addresses:", err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3001/get-buildings")
      .then((res) => {
        setBuildings(res.data);
      })
      .catch((err) => console.error("Error fetching buildings:", err));
  }, []);

  const handleSort = (columnName) => {
    const direction =
      sortConfig.key === columnName && sortConfig.direction === "asc"
        ? "desc"
        : "asc";
    setSortConfig({ key: columnName, direction });

    const sortedData = [...buildings].sort((a, b) => {
      if (a[columnName] < b[columnName]) return direction === "asc" ? -1 : 1;
      if (a[columnName] > b[columnName]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setBuildings(sortedData);
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const filteredBuildings = buildings.filter((building) =>
    Object.values(building).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBuildings = filteredBuildings.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (showAddBuildings) {
    return (
      <div className="table-container">
        {showAddBuildings && <AddBuildings />}
      </div>
    );
  }

  return (
    <div className="table-container">
      {formVisible === 2 && (
        <>
          <h1>Status Related to Building: {selectedBuilding?.building_name}</h1>
          <table className="custom-table">
            <thead>
              <tr>
                <th>
                  <AiOutlineFieldNumber />
                </th>
                <th>Status Name</th>
              </tr>
            </thead>
            <tbody>
              {status.length > 0 ? (
                status.map((statusItem, index) => (
                  <tr key={statusItem.status_id}>
                    <td>{index + 1}</td>
                    <td>{statusItem.status_name}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">No Status found.</td>
                </tr>
              )}
            </tbody>
          </table>
          <button
            className="submit-button"
            onClick={() => setFormVisible(1)}>
            Back to Buildings
          </button>
        </>
      )}

       {formVisible === 3 && (
        <>
          <h1>Usage Related to Building: {selectedBuilding?.building_name}</h1>
          <table className="custom-table">
            <thead>
              <tr>
                <th>
                  <AiOutlineFieldNumber />
                </th>
                <th>Usage Name</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {usage.length > 0 ? (
                usage.map((usageItem, index) => (
                  <tr key={usageItem.usage_id}>
                    <td>{index + 1}</td>
                    <td>{usageItem.usage_name}</td>
                    <td>{usageItem.type}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>No Usage found.</td>
                </tr>
              )}
            </tbody>
          </table>
          <button className="submit-button " onClick={() => setFormVisible(1)}>Back to Buildings</button>
        </>
      )}

      {formVisible === 1 && (
        <>
          <h1>Buildings</h1>
          <div className="controls">
            <input
              type="text"
              className="form-control search-bar"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <button
              className="btn btn-primary add-button"
              onClick={showAllBuildings}
            >
              <FaPlus />
            </button>
          </div>
          <table className="custom-table" style={{ width: "1200px" }}>
            <thead>
              <tr>
                <th>
                  <AiOutlineFieldNumber />
                </th>
                <th onClick={() => handleSort("building_name")}>
                  Building Name <BiSortAlt2 />
                </th>       
                <th onClick={() => handleSort("documentationDate")}>
                  Documentation Date <BiSortAlt2 />
                </th>
                <th>Status</th>
                <th>Usages</th>
                <th>Street</th>
                <th>City</th>
                <th>360 View Link</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {buildings.length > 0 ? (
                currentBuildings.map((building, index) => (
                  <tr key={building._id}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>{building.building_name}</td>
                    <td>{building.documentationDate}</td>
                    <td><button className="view-button" onClick={() => handleStatusSearch(building._id)}><FaEye /></button></td>
                    <td><button className="view-button"  onClick={() => handleUsageSearch(building._id)} > <FaEye /> </button></td>

                    <td>
                      {addresses.find(
                        (address) => address._id === building.address_id
                      )?.street || "Unknown"}
                    </td>
                    <td>
                      {(() => {
                        const address = addresses.find(
                          (address) => address._id === building.address_id
                        );
                        return (
                          cities.find((city) => city._id === address?.city_id)
                            ?.city_name || "Unknown"
                        );
                      })()}
                    </td>
                    <td>{building.thsLink}</td>
                    <td>
                      <button className="edit-button">
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10">No Buildings found.</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="pagination">
            {Array.from(
              { length: Math.ceil(filteredBuildings.length / itemsPerPage) },
              (_, i) => (
                <button
                  key={i + 1}
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
};

export default ShowBuildings;
