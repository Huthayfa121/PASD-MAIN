import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ImageSlider = () => {
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [buildings, setBuildings] = useState({});
    const [loading, setLoading] = useState(true);

    const Back = () => {
        navigate('/')
    }
    useEffect(() => {
        // Fetch images and buildings concurrently
        const fetchData = async () => {
            try {
                const [imagesRes, buildingsRes] = await Promise.all([
                    axios.get('http://localhost:3001/images'),
                    axios.get('http://localhost:3001/get-buildings'),
                ]);

                setImages(imagesRes.data);

                // Convert buildings array into a dictionary
                const buildingsMap = buildingsRes.data.reduce((acc, building) => {
                    acc[building._id] = building.building_name;
                    return acc;
                }, {});
                setBuildings(buildingsMap);

                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    // Group images by building
    const imagesByBuilding = images.reduce((acc, image) => {
        const buildingName = buildings[image.building_id] || 'Unknown Building';
        if (!acc[buildingName]) {
            acc[buildingName] = [];
        }
        acc[buildingName].push(image);
        return acc;
    }, {});

    return (
        <>
            <style>
                {`
                        body {
                        margin: 20px;
                        font-family: 'Helvetica', sans-serif; /* Changed font to Helvetica */
                        background-color: #111;
                        color: #eee;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        text-align: center;
                    }
                    /* General Styles for Building Sections */
                    .building-section {
                        margin-top: 20px;
                        margin-bottom: 40px;
                        padding: 20px;
                        background-color: #ffffff;
                        border-radius: 10px;
                        text-align: center;
                        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
                    }

                    .building-section h2 {
                        font-size: 2em;
                        color: #000000;
                        margin-bottom: 20px;
                        text-shadow: 0px 5px 10px rgba(178, 50, 185, 0.4);
                    }

                    /* Image Grid */
                    .building-images {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr); /* Two images per row */
                        gap: 20px;
                        justify-items: center;
                    }

                    /* Image Container */
                    .image-container {
                        position: relative;
                        width: 620px; /* Half of 1200px */
                        height: 350px;
                        overflow: hidden;
                        border-radius: 10px;
                        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
                        transition: transform 0.3s ease;
                    }

                    .image-container:hover {
                        transform: scale(1.02);
                    }

                    /* Building Images */
                    .building-image {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        filter: brightness(0.9) contrast(1.2);
                        transition: filter 0.3s ease;
                    }

                    .image-container:hover .building-image {
                        filter: brightness(1) contrast(1.3);
                    }

                    /* Description Visibility */
                    .image-description {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        background: rgba(0, 0, 0, 0.7);
                        color: #fff;
                        font-size: 16px;
                        padding: 10px;
                        text-align: center;
                        opacity: 0;
                        transform: translateY(100%);
                        transition: opacity 0.3s ease, transform 0.3s ease;
                    }

                    .image-container:hover .image-description,
                    .image-container:focus .image-description {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    .btn{
                        width: 120px;
                        height: 40px;
                        font-size: 20px;
                        font-weight: bold;
                        color: black;
                        background-color: white;
                        border-radius: 5px;
                    }
                        .btn:hover{
                            color: white;
                            background-color: rgb(178, 50, 185);
                            
                        }

                    /* Responsive Design */
                    @media screen and (max-width: 1250px) {
                        .building-images {
                            grid-template-columns: 1fr; /* One image per row on small screens */
                        }

                        .image-container {
                            width: 100%;
                            max-width: 95%;
                            height: auto;
                        }

                        .building-section h2 {
                            font-size: 1.5em;
                        }
                    }

                `}
            </style>
        <div className="slider">
            <h1>Buildings and Their Images</h1>
            {Object.keys(imagesByBuilding).map((buildingName) => (
                <div className="building-section" key={buildingName}>
                    <h2>{buildingName}</h2>
                    <div className="building-images">
                        {imagesByBuilding[buildingName].map((image) => (
                            <div className="image-container" key={image._id}>
                                <img src={image.image} alt={image.description} className="building-image" style={{width: "600px", height: "350"}} />
                                <div className="image-description">{image.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
                <button type='submit' className="btn" onClick={Back}>Home</button>
            </div>
            </>
    );
};

export default ImageSlider;
