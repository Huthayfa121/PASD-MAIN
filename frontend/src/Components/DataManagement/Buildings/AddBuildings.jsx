import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddBuildings.css";
import ReactSelect from "react-select";
import { useNavigate } from 'react-router-dom';



const AddBuildings = () => {

 const navigate = useNavigate();
   const Back = () => {
         navigate('/')
     }


  const [building_name, setBuildingName] = useState("");
  const [bdr_id, setBdrId] = useState("");
  const [dateOfConstruction, setDateOfConstruction] = useState("");
  const [documentationDate, setDocumentationDate] = useState("");
  const [area, setArea] = useState("");
  const [thsLink, setThsLink] = useState("");
  const [ar_description, setAr_description] = useState("");
  const [en_description, setEn_description] = useState("");
  const [numberOfFloors, setNumberOfFloors] = useState("");
  const [street, setStreet] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [country_id, setCountryId] = useState("");
  const [city_id, setCityId] = useState("");
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [architects, setArchitects] = useState([]);
  const [owners, setOwners] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [notaries, setNotaries] = useState([]);
  const [bdrs, setBDRs] = useState([]);
  const [originalUsage, setOriginalUsage] = useState([]);
  const [currentUsage, setCurrentUsage] = useState([]);
  const [status, setStatus] = useState([]);
  const [frontImageLink, setFile] = useState();
  const [originalUsageArray, setOriginalUsageArray] = useState([]);
  const [currentUsageArray, setCurrentUsageArray] = useState([]);
  const [statusArray, setStatusArray] = useState([]);
  const [ownerArray, setOwnerArray] = useState([]);
  const [notaryArray, setNotaryArray] = useState([]);
  const [architectArray, setArchitectArray] = useState([]);
  const [tenantArray, setTenantArray] = useState([]);

  const handleOwChange = (selectedOwOption) => {
    const formattedData = selectedOwOption.map((option) => ({
      building_id: localStorage.getItem('building_id'),
      owner_id: option.value,
    }));
    setOwnerArray(formattedData);
  };

  const handleTeChange = (selectedTeOption) => {
    const formattedData = selectedTeOption.map((option) => ({
      building_id: localStorage.getItem('building_id'),
      tenant_id: option.value,
    }));
    setTenantArray(formattedData);
  };

  const handleNoChange = (selectedNoOption) => {
    const formattedData = selectedNoOption.map((option) => ({
      building_id: localStorage.getItem('building_id'),
      building_name: building_name,
      notary_id: option.value,
    }));
    setNotaryArray(formattedData);
  };

  const handleArChange = (selectedArOption) => {
    const formattedData = selectedArOption.map((option) => ({
      building_id: localStorage.getItem('building_id'),
      architect_id: option.value,
    }));
    setArchitectArray(formattedData);
  };

   const handleOrChange = (selectedOrOption) => {
    const formattedData = selectedOrOption.map((option) => ({
      building_id: localStorage.getItem('building_id'),
      usage_id: option.value,
      type: "original",
    }));
    setOriginalUsageArray(formattedData);
  };

  const handleCuChange = (selectedCuOption) => {
    const formattedData = selectedCuOption.map((option) => ({
      building_id: localStorage.getItem('building_id'),
      usage_id: option.value,
      type: "current",
    }));
    setCurrentUsageArray(formattedData);
    
  }; //setStatusArray


  const handleSChange = (selectedSOption) => {
    const formattedData = selectedSOption.map((option) => ({
      building_id: localStorage.getItem('building_id'),
      status_id: option.value
    }));
    setStatusArray(formattedData);
    
  };


  const addUsageToBackend = async (usage) => {
      try {
        const { building_id, usage_id, type } = usage;
        // Log data before sending to backend for debugging
        console.log("Sending data:", { building_id, usage_id, type });
        const response = await axios.post("http://localhost:3001/add-building-usage", {building_id,usage_id,type,});

      } catch (error) {
        console.error("Error adding usage:", error);
        alert("Failed to add usage. Please try again.");
      }
  };
  
   const addStatusToBackend = async (status) => {
      try {
        const { building_id, status_id } = status;
        // Log data before sending to backend for debugging
        console.log("Sending data:", { building_id, status_id});
        const response = await axios.post("http://localhost:3001/add-building-status", {building_id,status_id});
      } catch (error) {
        console.error("Error adding status:", error);
        alert("Failed to add status. Please try again.");
      }
  };
  

   const addArchitectsToBackend = async (architect) => {
      try {
        const { building_id, architect_id } = architect;
        // Log data before sending to backend for debugging
        console.log("Sending data:", { building_id, architect_id});
        await axios.post("http://localhost:3001/add-buildings-architects", {building_id, architect_id});
      } catch (error) {
        console.error("Error adding architects:", error);
        alert("Failed to add architects. Please try again.");
      }
  };
  
  const addNotariesToBackend = async (notary) => {
      try {
        const { building_id, notary_id, building_name} = notary;
        // Log data before sending to backend for debugging
        console.log("Sending data:", { building_id, notary_id});
        await axios.post("http://localhost:3001/add-buildings-notaries", {building_id, notary_id, building_name});
      } catch (error) {
        console.error("Error adding notary:", error);
        alert("Failed to add notary. Please try again.");
      }
  };
  
  const addTenantsToBackend = async (tenant) => {
      try {
        const { building_id, tenant_id } = tenant;
        // Log data before sending to backend for debugging
        console.log("Sending data:", { building_id, tenant_id});
        await axios.post("http://localhost:3001/add-buildings-tenants", {building_id, tenant_id});
      } catch (error) {
        console.error("Error adding tenant:", error);
        alert("Failed to add tenant. Please try again.");
      }
  };
  
  const addOwnersToBackend = async (owner) => {
      try {
        const { building_id, owner_id } = owner;
        // Log data before sending to backend for debugging
        console.log("Sending data:", { building_id, owner_id});
        await axios.post("http://localhost:3001/add-buildings-owners", {building_id, owner_id});
      } catch (error) {
        console.error("Error adding owner:", error);
        alert("Failed to add owner. Please try again.");
      }
  };
  

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const addressResponse = await axios.post("http://localhost:3001/AddAddress", {
      city_id,
      street,
      coordinates,
    });

    if (addressResponse.status === 201) {
      const { addresses } = addressResponse.data;
      const address_id = addresses._id;
      localStorage.setItem('address_id', address_id);

      const buildingResponse = await axios.post("http://localhost:3001/AddBuilding", {
        building_name,
        area,
        ar_description,
        en_description,
        thsLink,
        frontImageLink,
        dateOfConstruction,
        documentationDate,
        numberOfFloors,
        bdr_id,
        address_id,
      });

      if (buildingResponse.status === 201) {
        const { buildings } = buildingResponse.data;
        const building_id = buildings._id;
        localStorage.setItem('building_id', building_id);

        // Pass the building_id directly to backend functions
        for (const usage of originalUsageArray) {
          await addUsageToBackend({ ...usage, building_id });
        }
        for (const usage of currentUsageArray) {
          await addUsageToBackend({ ...usage, building_id });
        }
        for (const status of statusArray) {
          await addStatusToBackend({ ...status, building_id });
        }
        for (const architect of architectArray) {
          await addArchitectsToBackend({ ...architect, building_id });
        }
        for (const notary of notaryArray) {
          await addNotariesToBackend({ ...notary, building_id });
        }
        for (const tenant of tenantArray) {
          await addTenantsToBackend({ ...tenant, building_id });
        }
        for (const owner of ownerArray) {
          await addOwnersToBackend({ ...owner, building_id });
        }

        alert("Building and related data added successfully!");

      }
    }
  } catch (error) {
    console.error("Error during submission:", error);
    alert("Failed to submit data. Please try again.");
  }
};

  
   // Fetch all status
  useEffect(() => {
    axios.get("http://localhost:3001/status") 
      .then((res) => {
        setStatus(res.data); // Save the fetched data in the state
        
      })
      .catch((err) => { console.error("Error fetching usage:", err);});
  }, []);

  // Fetch all usage
  useEffect(() => {
    axios.get("http://localhost:3001/usage") 
      .then((res) => {
        setOriginalUsage(res.data); // Save the fetched data in the state
        setCurrentUsage(res.data);
      })
      .catch((err) => { console.error("Error fetching usage:", err);});
  }, []);

  // Fetch all countries
  useEffect(() => {
    axios.get("http://localhost:3001/countries") 
      .then((res) => {
        setCountries(res.data); // Save the fetched data in the state
      })
      .catch((err) => { console.error("Error fetching countries:", err);});
    }, []);

  // Fetch cities whenever the selected country_id changes
  useEffect(() => {
    if (country_id) {
      axios.get(`http://localhost:3001/cities?country_id=${country_id}`)
        .then((res) => {setCities(res.data); })
        .catch((err) => {console.error("Error fetching cities:", err); });
    } else {
      setCities([]); // Clear cities if no country is selected
    }
  }, [country_id]);


  // Fetch all Architects
  useEffect(() => {
    axios.get("http://localhost:3001/Architects")
      .then((res) => {setArchitects(res.data); // Save the fetched data in the state
      })
      .catch((err) => {console.error("Error fetching Architects:", err);});
  }, []);

  // Fetch all Owners
  useEffect(() => {
    axios.get("http://localhost:3001/owners")
      .then((res) => {setOwners(res.data); // Save the fetched data in the state
      })
      .catch((err) => {console.error("Error fetching Owners:", err);});
    }, []);

  // Fetch all Tenants
  useEffect(() => {
    axios.get("http://localhost:3001/tenants")
      .then((res) => {setTenants(res.data); // Save the fetched data in the state
      })
      .catch((err) => { console.error("Error fetching tenants:", err);});
  }, []);

  // Fetch all Notaries
  useEffect(() => {
    axios.get("http://localhost:3001/notaries")
      .then((res) => {setNotaries(res.data); // Save the fetched data in the state
      })
      .catch((err) => { console.error("Error fetching notaries:", err);});
  }, []);


  // Fetch all BDRs
  useEffect(() => {
    axios.get("http://localhost:3001/bdr")
      .then((res) => {setBDRs(res.data); // Save the fetched data in the state
      })
      .catch((err) => { console.error("Error fetching BDRs:", err);});
  }, []);



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

    

  return (
    <div className="add-building-container">
      <h1 className="add_Buildings_h">Add Building</h1>
      

      <form className="add-building-form" onSubmit={handleSubmit}>
        <div className="form-boxes">
          {/* Box 1 */}
          <div className="form-box">
            <label className="add-building-label">Building Name</label>
            <div className="form-group">
              <input type="text" name="building_name" onChange={(e) => setBuildingName(e.target.value)}/>
            </div>

            
            <label className="add-building-label">Architect Name</label>

            <div className="form-group">
              <ReactSelect className="ReactSelect"
                options={architects.map((architect) => ({
                  value: architect._id,
                  label:architect.architect_name
                }))}
                isMulti={true}
                onChange={handleArChange}
                placeholder="Select Architect Name"
              />
            </div>

            <label className="add-building-label">Owner Name</label>
            <div className="form-group">
              <ReactSelect className="ReactSelect"
                options={owners.map((owner) => ({
                  value: owner._id,
                  label:owner.owner_name
                }))}
                isMulti={true}
                onChange={handleOwChange}
                placeholder="Select Owner Name"
              />
            </div>

             <label className="add-building-label">Tenant Name</label>
            <div className="form-group">
              <ReactSelect className="ReactSelect"
                options={tenants.map((tenant) => ({
                  value: tenant._id,
                  label:tenant.tenant_name
                }))}
                isMulti={true}
                onChange={handleTeChange}
                placeholder="Select Tenant Name"
              />
            </div>
            
            <label className="add-building-label">Notary Name</label>

            <div className="form-group">
              <ReactSelect className="ReactSelect"
                options={notaries.map((notary) => ({
                  value: notary._id,
                  label:notary.notary_name
                }))}
                isMulti={true}
                onChange={handleNoChange}
                placeholder="Select Notary Name"
              />
            </div>
          </div>

          {/* Box 2 */}
          <div className="form-box">

            <label className="add-building-label">Country</label>
            <div className="form-group">
              <select name="country_id"
                value={country_id}
                onChange={(e) => setCountryId(e.target.value)}>
               <option value="" disabled>
                  Select a Country
                </option>
                {countries.map((country) => (
                  <option key={country._id} value={country._id}>
                    {country.country_name}
                  </option>
                ))}
              </select>
            </div>

            <label className="add-building-label">City</label>
            <div className="form-group">
              <select name="city_name" value={city_id} onChange={(e) => setCityId(e.target.value)}>
                <option value="">
                  Select City
                </option>
                {cities.map((city) => (
                  <option key={city._id} value={city._id}>
                    {city.city_name}
                  </option>
                ))}
              </select>
            </div>

            <label className="add-building-label">Street</label>
            <div className="form-group">
              <input type="text" name="street" onChange={(e) => setStreet(e.target.value)}/>
            </div>

            <label className="add-building-label">Coordinates</label>
            <div className="form-group">
              <input
                  type="text"
                  name="coordinates"
                  placeholder="latitude, longitude"
                  onChange={(e) => {
                    const value = e.target.value;
                    const coords = value.split(",").map((coord) => parseFloat(coord.trim()));
                      setCoordinates(coords);
                  }}
                />
            </div>

            <label className="add-building-label">Front Image Link</label>
            <div className="form-group">
              <input type="file" name="frontImageLink" accept=".png, .jpg, .jpeg, .svg" onChange={handleFileChange} />
            </div>
            
          </div>

          {/* Box 3 */}
          <div className="form-box">
           
            <label className="add-building-label">Date of Construction</label>
            <div className="form-group">
              <input type="number" name="dateOfConstruction" onChange={(e) => setDateOfConstruction(e.target.value)} min="1900" />
            </div>


            <label className="add-building-label">Documentation Date</label>
            <div className="form-group">
              <input type="number" name="documentationDate" onChange={(e) => setDocumentationDate(e.target.value)} min="2022"/>
            </div>

            <label className="add-building-label">Building During the Reign</label>
            <div className="form-group">
              <select name="bdr_id" value={bdr_id} onChange={(e) => setBdrId(e.target.value)}>
                <option value="">
                  Select Reign
                </option>
                {bdrs.map((bdr) => (
                  <option key={bdr._id} value={bdr._id}>
                    {bdr.bdr_name}
                  </option>
                ))}
              </select>
            </div>


            <label className="add-building-label">Original Usage</label>
            <div className="form-group">
              <ReactSelect className="ReactSelect"
                options={originalUsage.map((usage) => ({
                  value: usage._id,
                  label:usage.use_type
                }))}
                isMulti={true}
                onChange={handleOrChange}
                placeholder="Select Original Usage"
              />
            </div>

            <label className="add-building-label">Current Usage</label>
              <div className="form-group">
                <ReactSelect
                  className="ReactSelect"
                  options={currentUsage.map((usage) => ({
                    value: usage._id,
                    label:usage.use_type
                  }))}
                  isMulti={true}
                  onChange={handleCuChange}
                  placeholder="Select Current Usage"
                />
              </div>

            <label className="add-building-label">Status</label>
            <div className="form-group">
              <ReactSelect className="ReactSelect"
                options={status.map((status) => ({
                  value: status._id,
                  label: status.status_name,
                }))}
                isMulti={true}
                onChange={handleSChange}
                placeholder="Select Status"
              />
            </div>
            
          </div>

          {/* Box 4 */}
          <div className="form-box">

          <label className="add-building-label">Area (in square meters)</label>
            <div className="form-group">
              <input type="number" name="area" onChange={(e) => setArea(e.target.value)} min="1"/>
            </div>

            <label className="add-building-label">Number of Floors</label>
            <div className="form-group">
              <input type="number" name="numberOfFloors" onChange={(e) => setNumberOfFloors(e.target.value)} min="1"/>
            </div>
            

            <label className="add-building-label" >360 View Link</label>
            <div className="form-group">
              <input type="text" name="thsLink" onChange={(e) => setThsLink(e.target.value)}/>
            </div>

            <label className="add-building-label" >Building Description in Arabic</label>
            <div className="form-group">
              <textarea name="ar_description" onChange={(e) => setAr_description(e.target.value)}/>
            </div>

            <label className="add-building-label" >Building Description in English</label>
            <div className="form-group">
              <textarea name="en_description" onChange={(e) => setEn_description(e.target.value)} />
            </div>

            <button type="submit" className="submit-button">Add Building</button>
          </div>
        </div>
      </form>
      <button className="AddAdminBtn" style={{width: "100px"}} onClick={Back}>Home</button>
    </div>
  );
};

export default AddBuildings;