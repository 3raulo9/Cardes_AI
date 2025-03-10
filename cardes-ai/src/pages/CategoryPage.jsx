// CategoryPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import axiosInstance from "../utils/axiosInstance";
import Loader from "../components/Loader";
import TutorialOverlay from "../components/TutorialOverlay"; // <-- same overlay component

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch categories on mount
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

  // Create a new category
  const createCategory = async () => {
    const name = prompt("Enter category name:");
    if (!name) return;

    try {
      const response = await axiosInstance.post("/api/categories/", {
        name: name,
        color: "#FF5733", // Default color (optional)
      });
      setCategories([...categories, response.data]);
    } catch (error) {
      console.error("Error creating category:", error.response?.data || error.message);
      alert(`Error: ${JSON.stringify(error.response?.data)}`);
    }
  };

  // Delete a category
  const deleteCategory = async (categoryId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category? All sets and cards within it will also be deleted."
    );
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/api/categories/${categoryId}/`);
      setCategories(categories.filter((cat) => cat.id !== categoryId));
    } catch (error) {
      console.error("Error deleting category:", error.response?.data || error.message);
      alert(`Error: ${JSON.stringify(error.response?.data)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-primary via-[-10%] via-darkAccent text-white">
      {/* The shared tutorial overlay, ID = "categories" */}
      <TutorialOverlay tutorialID="categories" />

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

      {/* Scrollable Categories Grid */}
      <main className="flex-1 overflow-y-auto px-4 pb-6 pt-4">
        {loading ? (
          <Loader />
        ) : categories.length === 0 ? (
          <p className="text-center text-gray-300 text-lg mt-4">
            You haven't added any categories yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {categories.map((category) => (
              <div
                key={category.id}
                className="p-4 bg-secondary text-white rounded-lg shadow-md transition duration-300 hover:scale-105 hover:shadow-xl flex flex-col justify-between"
              >
                {/* Category name (click to view sets) */}
                <strong
                  onClick={() => navigate(`/categories/${category.id}`)}
                  className="block mb-2 text-xl cursor-pointer hover:underline"
                >
                  {category.name}
                </strong>

                {/* Delete button */}
                <button
                  onClick={() => deleteCategory(category.id)}
                  className="flex items-center justify-center bg-red-500 hover:bg-red-700 text-white px-3 py-2 rounded-md transition mt-2"
                >
                  <FiTrash2 className="mr-2" />
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CategoryPage;
