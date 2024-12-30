import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaPlus } from "react-icons/fa";
import { BiSortAlt2 } from "react-icons/bi";
import { AiOutlineFieldNumber } from "react-icons/ai";
import AddBuildings from './AddBuildings'



const ShowBuildings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [buildings, setBuildings] = useState([]); // State to store building data
  const [ShowAddBuildings, setAddShowBuildings] = useState(false);


  const ShowAllBuildings = () => {
    setAddShowBuildings(true)
  }

  // Fetch all buildings data
  useEffect(() => {
    axios.get("http://localhost:3001/get-buildings")
      .then((res) => {
        setBuildings(res.data); // Save the fetched data in the state
      })
      .catch((err) => {
        console.error("Error fetching buildings:", err);
      });
  }, []); // Run only once when the component mounts

  const handleSort = (columnName) => {
    console.log("Sorting column:", columnName);
    let direction = "asc";
    if (sortConfig.key === columnName && sortConfig.direction === "asc") {
        direction = "desc";
    }
    setSortConfig({ key: columnName, direction });

    const sortedData = [...buildings].sort((a, b) => {
        console.log("Comparing:", a[columnName], b[columnName]);
        if (a[columnName] < b[columnName]) return direction === "asc" ? -1 : 1;
        if (a[columnName] > b[columnName]) return direction === "asc" ? 1 : -1;
        return 0;
    });
    console.log("Sorted Data:", sortedData);
    setBuildings(sortedData);
};

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };


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

  if (ShowAddBuildings) {
    return (
      <div className="table-container">
      {ShowAddBuildings && <AddBuildings />}
    </div>
    );
  }
  return (
    <div className="table-container">
      <h1>Buildings</h1>
      
      <div className="controls">
        <input type="text" className="form-control search-bar" placeholder="Search..." value={searchTerm}  onChange={handleSearch} />
        <button className="btn btn-primary add-button" onClick={() => {
          ShowAllBuildings();
        }}> <FaPlus /></button>
      </div>

      <table className="custom-table">
          <thead>
          <tr>
            <th><AiOutlineFieldNumber /></th>
            <th onClick={() => handleSort("building_name")}>
              Building Name <span><BiSortAlt2 /></span>
            </th>
            <th onClick={() => handleSort("area")}>
              Area <span><BiSortAlt2 /></span>
            </th>
            <th onClick={() => handleSort("en_description")}>
              Engish Description <span><BiSortAlt2 /></span>
            </th>
            <th>Actions</th>
          </tr>
        </thead>

         <tbody>
          {buildings.length > 0 ? (
            currentBuildings.map((building, index) => (
              <tr key={building._id}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td>{building.building_name}</td>
                <td>{building.area}</td>
                <td>{building.en_description}</td>
                <td>
                <button className="edit-button"><FaEdit /> </button>
                </td>
              </tr>
              
            ))
            ) : (
            <tr>
            <td colSpan="4">No Buildings found.</td>
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
              className={`page-button ${currentPage === i + 1 ? "active" : ""}`}
              onClick={() => paginate(i + 1)}
            >
              {i + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default ShowBuildings;
