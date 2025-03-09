import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom"; // 🛠️ Import useNavigate
import { FiPlus, FiArrowLeft } from "react-icons/fi"; // 🛠️ Import Back Icon
import Loader from "../components/Loader"; // Import the Loader component

const CardSetsPage = () => {
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const { id } = useParams(); // Category ID from URL
  const navigate = useNavigate(); // 🛠️ Initialize navigate function

  useEffect(() => {
    axiosInstance
      .get("/api/cardsets/")
      .then((res) => {
        const filteredSets = res.data.filter((set) => set.category === parseInt(id));
        setSets(filteredSets);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching sets:", err);
        setLoading(false);
      });
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
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-primary via-[-10%] via-darkAccent text-white">
      {/* Sticky Header */}
      <div className="p-6 bg-secondary flex justify-between items-center sticky top-0 z-10 shadow-md">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/categories")}
            className="bg-primary text-white px-3 py-2 rounded-lg flex items-center mr-4 hover:bg-highlight transition"
          >
            <FiArrowLeft className="mr-2" /> Back
          </button>
          <h1 className="text-2xl font-bold text-white">Card Sets</h1>
        </div>

        <button 
          onClick={createSet} 
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-highlight transition"
        >
          <FiPlus className="mr-2" /> Add Set
        </button>
      </div>

      {/* Scrollable Card Sets List */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <Loader />
        ) : (
          <ul className="space-y-4">
            {sets.length > 0 ? (
              sets.map((set) => (
                <li
                  key={set.id}
                  className="p-4 bg-secondary text-white rounded-lg flex justify-between items-center transition-transform duration-300 ease-out hover:scale-100 hover:shadow-md"
                >
                  <span
                    onClick={() => navigate(`/categories/${id}/sets/${set.id}`)}
                    className="cursor-pointer flex-1"
                  >
                    {set.name}
                  </span>
                  <button
                    onClick={() => startPractice(set.id)}
                    className="bg-primary text-white px-3 py-1 rounded-lg hover:bg-highlight transition"
                  >
                    Practice
                  </button>
                </li>
              ))
            ) : (
              <p className="text-white text-center mt-4">
                No sets available. Create a new one!
              </p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CardSetsPage;
