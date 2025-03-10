import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import { FiPlus, FiArrowLeft } from "react-icons/fi";
import Loader from "../components/Loader";

const CardSetsPage = () => {
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); // Category ID from URL
  const navigate = useNavigate();

  useEffect(() => {
    // First, check if any categories exist
    axiosInstance
      .get("/api/categories/")
      .then((res) => {
        if (res.data.length === 0) {
          // If no categories exist, redirect to /categories
          navigate("/categories");
        } else {
          // If categories exist, fetch the card sets filtered by category
          axiosInstance
            .get("/api/cardsets/")
            .then((res) => {
              const filteredSets = res.data.filter(
                (set) => set.category === parseInt(id)
              );
              setSets(filteredSets);
              setLoading(false);
            })
            .catch((err) => {
              console.error("Error fetching sets:", err);
              setLoading(false);
            });
        }
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setLoading(false);
      });
  }, [id, navigate]);

  const createSet = async () => {
    const name = prompt("Enter set name:");
    if (!name) return;

    try {
      const response = await axiosInstance.post("/api/cardsets/", {
        name: name,
        category: parseInt(id),
      });
      setSets([...sets, response.data]); // Update UI with new set
    } catch (error) {
      console.error("Error creating set:", error.response?.data || error.message);
      alert(`Error: ${JSON.stringify(error.response?.data)}`);
    }
  };

  const goToSet = (setId) => {
    // Navigate to the list of cards in this set
    navigate(`/categories/${id}/sets/${setId}`);
  };

  const startPractice = (setId) => {
    navigate(`/practice/${setId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-primary via-[-10%] via-darkAccent text-white">
      {/* Sticky Header */}
      <header className="relative z-10">
        <div className="bg-secondary px-6 py-4 flex justify-between items-center shadow-md">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/categories")}
              className="bg-primary text-white px-3 py-2 rounded-lg flex items-center hover:bg-highlight transition"
            >
              <FiArrowLeft className="mr-2" /> Back
            </button>
            <h1 className="text-2xl font-bold text-white ml-4">Card Sets</h1>
          </div>
          <button
            onClick={createSet}
            className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-highlight transition"
          >
            <FiPlus className="mr-2" /> Add Set
          </button>
        </div>
      </header>

      {/* Scrollable Sets Grid */}
      <main className="flex-1 overflow-y-auto px-4 pb-6 pt-4">
        {loading ? (
          <Loader />
        ) : sets.length === 0 ? (
          <p className="text-center text-gray-300 text-lg mt-4">
            No sets available. Create one!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {sets.map((set) => (
              <div
                key={set.id}
                className="p-4 bg-secondary text-white rounded-lg shadow-md transition duration-300 hover:scale-105 hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Set Name */}
                  <strong className="block mb-2 text-xl">{set.name}</strong>
                  {/* Additional data for the set could go here */}
                </div>
                {/* Buttons */}
                <div className="flex mt-4 gap-2">
                  <button
                    onClick={() => goToSet(set.id)}
                    className="flex-1 bg-primary text-white px-3 py-2 rounded-lg hover:bg-highlight transition"
                  >
                    View Cards
                  </button>
                  <button
                    onClick={() => startPractice(set.id)}
                    className="flex-1 bg-primary text-white px-3 py-2 rounded-lg hover:bg-highlight transition"
                  >
                    Practice
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CardSetsPage;
