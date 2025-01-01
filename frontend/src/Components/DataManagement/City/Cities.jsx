import React, { useState, useEffect } from "react";
import axios from "axios";
import { BiSortAlt2 } from "react-icons/bi";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { FaLocationDot, FaTreeCity } from "react-icons/fa6";
import { FaEdit, FaEye, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const Cities = () => {

  const navigate = useNavigate();
    const Back = () => {
          navigate('/')
  }
  
    const [cities, setCities] = useState([]);
    const [countries, setCountries] = useState([]); // State to hold country data
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [addCity, setAddCity] = useState(false);
    const [city_name, setCitieName] = useState(""); // State for city name
    const [country_id, setCountryId] = useState("");



  // Fetch notaries
  useEffect(() => {
    axios
      .get("http://localhost:3001/get-cities")
      .then((res) => {
        setCities(res.data);
      })
      .catch((err) => {
        console.error("Error fetching Cities:", err);
      });
  }, []);
    
    
    
    // Fetch countries on component load
  useEffect(() => {
    axios
      .get("http://localhost:3001/countries") // Correct API endpoint
      .then((res) => {
        setCountries(res.data); // Save the fetched data in the state
      })
      .catch((err) => {
        console.error("Error fetching countries:", err);
      });
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3001/cities", { country_id, city_name }); // Corrected URL
        alert("City added successfully!");
        setAddCity(false)
      
    } catch (error) {
      console.error("Error adding city:", error);
      alert("Failed to add city. Please try again.");
    }
    };


  const handleSort = (columnName) => {
    const direction =
      sortConfig.key === columnName && sortConfig.direction === "asc"
        ? "desc"
        : "asc";
    setSortConfig({ key: columnName, direction });

    const sortedData = [...cities].sort((a, b) => {
      if (a[columnName] < b[columnName]) return direction === "asc" ? -1 : 1;
      if (a[columnName] > b[columnName]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setCities(sortedData);
  };

  const handleEdit = (id) => {
    const newName = prompt("Enter new city name:");
    if (newName) {
      axios
        .put(`http://localhost:3001/cities/${id}`, { city_name: newName })
        .then(() => {
          alert("City updated successfully");
          setCities((prev) =>
            prev.map((city) =>
              city._id === id ? { ...city, city_name: newName } : city
            )
          );
        })
        .catch((err) => {
          console.error("Error updating city:", err);
          alert("Failed to update city");
        });
    }
  };

  const filteredCities = cities.filter((city) =>
    Object.values(city)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCities = filteredCities.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (addCity) {
      return (
          <div className="AddAdminHome">
               <div className="AddAdminWrapper" style={{ height: "450px" }}>
                  <div className="AddAdminFormBox">
                    <h2 className="AddAdminTitle">Add New City</h2>
                    <form onSubmit={handleSubmit}>
                      {/* City Name Input */}
                      <div className="AddAdminInputBox">
                        <input
                          type="text"
                          name="city_name"
                          value={city_name}
                          onChange={(e) => setCitieName(e.target.value)}
                          required
                        />
                        <label>City Name</label>
                        <FaTreeCity className="icon" />
                      </div>
          
                      {/* Country Dropdown */}
                      <div className="AddAdminInputBox">
                        <select
                          name="country_id"
                          value={country_id}
                          onChange={(e) => setCountryId(e.target.value)}
                          required
                        >
                          <option value="" disabled>
                            Select a Country
                          </option>
                          {countries.map((country) => (
                            <option key={country._id} value={country._id}>
                              {country.country_name} {/* Adjusted to match backend property */}
                            </option>
                          ))}
                        </select>
                        <FaLocationDot  className="icon" />
                      </div>
          
                      {/* Submit Button */}
                      <button type="submit" className="AddAdminBtn">
                        Add City
                      </button>
              </form>
              <button className="AddAdminBtn" style={{width: "100px"}} onClick={Back}>Home</button>
                  </div>
                </div>
              </div>
      );
      
  } else if(!addCity) {
    return (
      <div className="table-container">
        <h1>Cities</h1>
        <div className="controls">
          <input
            type="text"
            className="form-control search-bar"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-primary add-button" onClick={() => setAddCity(true)}>
            <FaPlus />
          </button>
        </div>
        <table className="custom-table">
          <thead>
            <tr>
              <th>
                <AiOutlineFieldNumber />
              </th>
              <th onClick={() => handleSort("city_name")}>
                City Name <BiSortAlt2 />
              </th>
              <th onClick={() => handleSort("country_id")}>
                Country <BiSortAlt2 />
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCities.length > 0 ? (
                currentCities.map((city, index) => (
                    <tr key={city._id}>
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td>{city.city_name}</td>
                        <td>{countries.find((country) => country._id === city.country_id)?.country_name || "Unknown"}</td>
                        <td>
                        <button
                            className="edit-button"
                            onClick={() => handleEdit(cities._id)}
                        >
                        <FaEdit />
                        </button>
                        </td>
                    </tr>
                    ))
                    ) : (
                    <tr>
                     <td colSpan="3">No cities found.</td>
                    </tr>
                )}
            </tbody>
        </table>
        <div className="pagination">
          {Array.from(
            { length: Math.ceil(filteredCities.length / itemsPerPage) },
            (_, i) => (
              <button
                key={i}
                className={`page-button ${currentPage === i + 1 ? "active" : ""}`}
                onClick={() => paginate(i + 1)}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
        <button className="AddAdminBtn" style={{width: "100px"}} onClick={Back}>Home</button>
      </div>
    );
  }
};

export default Cities;
