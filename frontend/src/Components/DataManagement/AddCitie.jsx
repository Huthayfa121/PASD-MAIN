import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaLocationDot ,FaTreeCity } from "react-icons/fa6";


const AddCitie = () => {
  const [countries, setCountries] = useState([]); // State to hold country data
  const [city_name, setCitieName] = useState(""); // State for city name
  const [country_id, setCountryId] = useState(""); // State for selected country ID
  const [formVisible, setFormVisible] = useState(true);

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
        setFormVisible(false);
      
    } catch (error) {
      console.error("Error adding city:", error);
      alert("Failed to add city. Please try again.");
    }
    };
    
     if (!formVisible) {
        return
    }

  return (
    <div className="AddAdminHome">
      <div className="AddAdminWrapper">
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
        </div>
      </div>
    </div>
  );
};

export default AddCitie;
