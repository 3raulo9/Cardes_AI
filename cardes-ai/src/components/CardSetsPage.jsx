import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";

const CardSetsPage = () => {
  const [sets, setSets] = useState([]);
  const { id } = useParams(); // Category ID from URL
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/api/cardsets/")
      .then((res) => {
        const filteredSets = res.data.filter((set) => set.category === parseInt(id));
        setSets(filteredSets);
      })
      .catch((err) => console.error("Error fetching sets:", err));
  }, [id]);

  const createSet = async () => {
    const name = prompt("Enter set name:");
    if (!name) return;

    try {
      const response = await axiosInstance.post("/api/cardsets/", {
        name: name,
        category: parseInt(id), // Ensure category ID is sent correctly
      });

      setSets([...sets, response.data]); // Update UI
    } catch (error) {
      console.error("Error creating set:", error.response?.data || error.message);
      alert(`Error: ${JSON.stringify(error.response?.data)}`);
    }
  };

  return (
    <div className="p-6 bg-accent min-h-screen"> {/* 🛠️ Applied `bg-accent` for background */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold ml-11 md:ml-0 text-white">Card Sets</h1> {/* 🛠️ Made text white for visibility */}
        <button
          onClick={createSet}
          className="bg-secondary text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FiPlus className="mr-2" /> Add Set
        </button>
      </div>

      <ul className="mt-4">
        {sets.length > 0 ? (
          sets.map((set) => (
            <li
              key={set.id}
              onClick={() => navigate(`/categories/${id}/sets/${set.id}`)}
              className="cursor-pointer p-4 bg-secondary text-white rounded-lg my-2"
            >
              {set.name}
            </li>
          ))
        ) : (
          <p className="text-white mt-4">No sets available. Create a new one!</p>
        )}
      </ul>
    </div>
  );
};

export default CardSetsPage;
