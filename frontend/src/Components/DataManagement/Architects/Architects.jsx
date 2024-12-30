import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaEye, FaPlus } from "react-icons/fa";
import { BiSortAlt2 } from "react-icons/bi";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { GoPersonFill } from "react-icons/go";
import './DataPage.css';

const Architects = () => {
  const [architects, setArchitects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [addArchitect, setAddArchitect] = useState(false);
  const [architect_name, setArchitectName] = useState("");
  const [architect_image, setFile] = useState("");
  const [en_biography, seten_biography] = useState("");
  const [ar_biography, setar_biography] = useState("");

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile(reader.result); // Set Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Make the API call to add a new architect
    axios
      .post("http://localhost:3001/add-architect", {
        architect_name,
        architect_image, // Base64 string
        en_biography,
        ar_biography,
      })
      .then((res) => {
        alert("Architect added successfully");
        setAddArchitect(false);
        setArchitects((prev) => [...prev, res.data]); // Add new architect to the list
      })
      .catch((err) => {
        console.error("Error adding architect:", err);
        alert("Failed to add architect");
      });
  };

  useEffect(() => {
    // Fetch architects on component mount
    axios
      .get("http://localhost:3001/architects")
      .then((res) => {
        setArchitects(res.data);
      })
      .catch((err) => {
        console.error("Error fetching architects:", err);
      });
  }, []);

  const handleSort = (columnName) => {
    const direction =
      sortConfig.key === columnName && sortConfig.direction === "asc"
        ? "desc"
        : "asc";
    setSortConfig({ key: columnName, direction });

    const sortedData = [...architects].sort((a, b) => {
      if (a[columnName] < b[columnName]) return direction === "asc" ? -1 : 1;
      if (a[columnName] > b[columnName]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setArchitects(sortedData);
  };

  const filteredArchitects = architects.filter((architect) =>
    Object.values(architect)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArchitects = filteredArchitects.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  if (addArchitect) {
    return (
      <div className='AddAdminHome'>
        <div className="AddAdminWrapper">
          <div className="AddAdminFormBox">
            <h2 className="AddAdminTitle">Add New Architect</h2>
            <form onSubmit={handleSubmit}>
              <div className="AddAdminInputBox">
                <input
                  type="text"
                  name="architectName"
                  onChange={(e) => setArchitectName(e.target.value)}
                  required
                />
                <label>Architect Name</label>
                <GoPersonFill className="icon" />
              </div>

              <label className="add-building-label">Architect Image</label>
              <div className="form-group">
                <input type="file" name="architect_image" onChange={handleFileChange} />
              </div>

              <label className="add-building-label">Arabic Biography</label>
              <div className="form-group">
                <textarea
                  name="ar_biography"
                  onChange={(e) => setar_biography(e.target.value)}
                />
              </div>

              <label className="add-building-label">English Biography</label>
              <div className="form-group">
                <textarea
                  name="en_biography"
                  onChange={(e) => seten_biography(e.target.value)}
                />
              </div>
              <button type="submit" className="AddAdminBtn">
                Add Architect
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <h1>Architects</h1>
      <div className="controls">
        <input
          type="text"
          className="form-control search-bar"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="btn btn-primary add-button"
          onClick={() => {
            setAddArchitect(true);
          }}
        >
          <FaPlus />
        </button>
      </div>
      <table className="custom-table">
        <thead>
          <tr>
            <th>
              <AiOutlineFieldNumber />
            </th>
            <th onClick={() => handleSort("architect_name")}>
              Architect Name <BiSortAlt2 />
            </th>
            <th>Architect Image</th>
            <th onClick={() => handleSort("en_biography")}>
              English Biography <BiSortAlt2 />
            </th>
            <th onClick={() => handleSort("ar_biography")}>
              Arabic Biography <BiSortAlt2 />
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentArchitects.length > 0 ? (
            currentArchitects.map((architect, index) => (
              <tr key={architect._id}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td>{architect.architect_name}</td>
                <td>
                  <img
                    src={architect.architect_image}
                    alt={architect.architect_name}
                    style={{ width: "50px", height: "50px" }}
                  />
                </td>
                <td>{architect.en_biography}</td>
                <td>{architect.ar_biography}</td>
                <td>
                  <button className="edit-button">
                    <FaEdit />
                  </button>
                  <button className="view-button">
                    <FaEye /> View Buildings
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No architects found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Architects;
