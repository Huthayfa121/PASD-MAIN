import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SowhImage = () => {
  const [buildings, setBuildings] = useState([]); // State to store building data

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

  return (
    <div>
      {buildings.length > 0 ? (
        buildings.map((building, index) => (
          <div key={index}>
            {/* Check if frontImageLink exists */}
            {building.frontImageLink ? (
              <div>
                <h3>{building.building_name}</h3>
                <img
                  src={building.frontImageLink} // Use the frontImageLink as the image source
                  alt={building.building_name}
                  style={{ width: '300px', height: 'auto', marginBottom: '10px' }}
                />
              </div>
            ) : (
              <p>No image available for this building</p>
            )}
          </div>
        ))
      ) : (
        <p>Loading buildings...</p>
      )}
    </div>
  );
};

export default SowhImage;
