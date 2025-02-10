import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom"; // 🛠️ Import useNavigate
import { FiPlus, FiArrowLeft } from "react-icons/fi"; // 🛠️ Import Back Icon

const CardSetsPage = () => {
  const [sets, setSets] = useState([]);
  const { id } = useParams(); // Category ID from URL
  const navigate = useNavigate(); // 🛠️ Initialize navigate function

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

  const startPractice = (setId) => {
    navigate(`/practice/${setId}`);
  };

  return (
    <div className="p-6 bg-accent min-h-screen"> {/* 🛠️ Applied `bg-accent` for background */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {/* 🛠️ Back Button Before the Title */}
          <button
            onClick={() => navigate("/categories")}
            className="bg-secondary text-white px-3 py-2 rounded-lg flex items-center mr-4 hover:bg-primary transition"
          >
            <FiArrowLeft className="mr-2" /> Back
          </button>
          <h1 className="text-2xl font-bold text-white">Card Sets</h1> {/* 🛠️ Made text white for visibility */}
        </div>

        <button onClick={createSet} className="bg-secondary text-white px-4 py-2 rounded-lg flex items-center">
          <FiPlus className="mr-2" /> Add Set
        </button>
      </div>

      <ul className="mt-4">
        {sets.length > 0 ? (
          sets.map((set) => (
            <li
              key={set.id}
              className="p-4 bg-secondary text-white rounded-lg my-2 flex justify-between items-center"
            >
              <span
                onClick={() => navigate(`/categories/${id}/sets/${set.id}`)}
                className="cursor-pointer"
              >
                {set.name}
              </span>
              <button
                onClick={() => startPractice(set.id)}
                className="bg-primary text-white px-3 py-1 rounded-lg"
              >
                Practice
              </button>
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
