import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import { FiPlus, FiArrowLeft, FiTrash2 } from "react-icons/fi";
import Loader from "../components/Loader";

const CardSetsPage = () => {
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); // Category ID from URL
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/api/categories/")
      .then((res) => {
        if (res.data.length === 0) {
          navigate("/categories");
        } else {
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
      setSets([...sets, response.data]);
    } catch (error) {
      console.error("Error creating set:", error.response?.data || error.message);
      alert(`Error: ${JSON.stringify(error.response?.data)}`);
    }
  };

  const editSet = async (set) => {
    const newName = prompt("Edit set name:", set.name);
    if (!newName || newName === set.name) return;

    try {
      const response = await axiosInstance.patch(`/api/cardsets/${set.id}/`, {
        name: newName,
      });

      setSets(
        sets.map((s) => (s.id === set.id ? { ...s, name: response.data.name } : s))
      );
    } catch (error) {
      console.error("Error updating set:", error.response?.data || error.message);
      alert(`Error: ${JSON.stringify(error.response?.data)}`);
    }
  };

  const deleteSet = async (setId) => {
    const confirmDelete = window.confirm("Delete this set and all its cards?");
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/api/cardsets/${setId}/`);
      setSets(sets.filter((s) => s.id !== setId));
    } catch (error) {
      console.error("Error deleting set:", error.response?.data || error.message);
      alert(`Error: ${JSON.stringify(error.response?.data)}`);
    }
  };

  const goToSet = (setId) => {
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
                  {/* Clickable set name */}
                  <strong
                    onClick={() => goToSet(set.id)}
                    className="block mb-2 text-xl cursor-pointer hover:underline transition"
                  >
                    {set.name}
                  </strong>
                </div>

                {/* View & Practice Buttons */}
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

                {/* Edit & Delete Buttons */}
                <div className="flex mt-2 gap-2">
                  <button
                    onClick={() => editSet(set)}
                    className="flex-1 bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => deleteSet(set.id)}
                    className="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    <FiTrash2 className="mr-2 inline-block" />
                    Delete
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
