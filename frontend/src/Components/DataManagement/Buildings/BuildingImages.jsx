import React, { useState, useEffect } from "react";
import axios from "axios";
import { PiBuildingApartmentFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import "./BuildingImages.css";


const BuildingImages = () => {
    const [buildings, setBuildings] = useState([]);
    const [building_id, setBuildingId] = useState("");
    const [image, setImage] = useState("");
    const [description, setDescription] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get("http://localhost:3001/get-buildings")
            .then((res) => {
                setBuildings(res.data); // Save the fetched data in the state
            })
            .catch((err) => {
                console.error("Error fetching buildings:", err);
            });
    }, []);

    const getFile = (event) => {
        setImage(URL.createObjectURL(event.target.files[0])); // Save the file object
    };

    const handleAddAnother = async (e) => {
        try {
            await axios.post("http://localhost:3001/add-images", { building_id, description, image });
            setDescription("");
            setImage(null);
        } catch (error) {
            alert("Failed to add image. Please try again.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3001/add-images", { building_id, description, image });
            alert("Images added successfully!");
            navigate("/Dashboard");
        } catch (error) {
            alert("Failed to add image. Please try again.");
        }
    };

    return (
        <div className="BuildingImagesWrapper">
            <div className="BuildingImagesBox">
                <h2 className="BuildingImagesTitle">Add Images</h2>
                <form onSubmit={handleAddAnother}>
                    <label htmlFor="building_id">Select Building</label>
                    <div className="InputGroup">
                        <select  id="building_id" name="building_id"  value={building_id}  onChange={(e) => setBuildingId(e.target.value)} required
                        >
                            <option></option>
                            {buildings.map((building) => (
                                <option key={building._id} value={building._id}>
                                    {building.building_name}
                                </option>
                            ))}
                        </select>
                        <PiBuildingApartmentFill className="IconWrapper" />
                    </div>

                    <div className="InputGroup">
                        <label htmlFor="description">Image Description</label>
                        <textarea id="description"  value={description} name="description" onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div className="InputGroup">
                        <label htmlFor="image">Upload Image</label>
                        <input type="file" id="image" name="image" onChange={getFile} required  />
                    </div>

                    <button type="submit" className="BuildingImagesBtn">
                        Add Another Image
                    </button>
                </form>
                <button onClick={handleSubmit} className="BuildingImagesBtn">
                    Submit
                </button>
            </div>
        </div>
    );
};

export default BuildingImages;
