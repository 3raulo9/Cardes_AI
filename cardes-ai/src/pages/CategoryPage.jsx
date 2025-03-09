import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import Loader from "../components/Loader"; // Import the loader component

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/api/categories/")
      .then((res) => {
        setCategories(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setLoading(false);
      });
  }, []);

  const createCategory = async () => {
    const name = prompt("Enter category name:");
    if (!name) return;

    try {
      const response = await axiosInstance.post("/api/categories/", {
        name: name,
        color: "#FF5733", // Default color
      });
      // Update UI with the new category
      setCategories([...categories, response.data]);
    } catch (error) {
      console.error(
        "Error creating category:",
        error.response?.data || error.message
      );
      alert(`Error: ${JSON.stringify(error.response?.data)}`);
    }
  };

  const deleteCategory = async (categoryId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category? All sets and cards within it will also be deleted."
    );
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/api/categories/${categoryId}/`);
      setCategories(categories.filter((category) => category.id !== categoryId));
    } catch (error) {
      console.error(
        "Error deleting category:",
        error.response?.data || error.message
      );
      alert(`Error: ${JSON.stringify(error.response?.data)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-primary via-[-10%] via-darkAccent text-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 shadow-md">
        <div className="bg-secondary px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Categories</h1>
          <button
            onClick={createCategory}
            className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-darkAccent transition"
          >
            <FiPlus className="mr-2" /> New Category
          </button>
        </div>
      </header>

      {/* Scrollable Category List */}
      <main className="flex-1 overflow-y-auto px-4 pb-6 pt-4">
        <ul className="space-y-4 max-w-3xl mx-auto">
          {/* If still loading or if no categories, show the Loader */}
          {loading || categories.length === 0 ? (
            <Loader />
          ) : (
            categories.map((category) => (
              <li
                key={category.id}
                className="bg-secondary text-white rounded-lg flex justify-between items-center px-4 py-3 shadow-md transform transition duration-200 hover:scale-[1.02]"
              >
                <span
                  onClick={() => navigate(`/categories/${category.id}`)}
                  className="cursor-pointer flex-1 hover:underline"
                >
                  {category.name}
                </span>
                <button
                  onClick={() => deleteCategory(category.id)}
                  className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded-lg ml-4 transition"
                >
                  <FiTrash2 />
                </button>
              </li>
            ))
          )}
        </ul>
      </main>
    </div>
  );
};

export default CategoryPage;
