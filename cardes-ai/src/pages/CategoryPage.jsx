import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiTrash2 } from "react-icons/fi"; // 🛠️ Import delete icon

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/api/categories/")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const createCategory = async () => {
    const name = prompt("Enter category name:");
    if (!name) return;

    try {
      const response = await axiosInstance.post("/api/categories/", {
        name: name,
        color: "#FF5733", // Default color
      });

      setCategories([...categories, response.data]); // Update UI
    } catch (error) {
      console.error("Error creating category:", error.response?.data || error.message);
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
      setCategories(categories.filter((category) => category.id !== categoryId)); // Update UI
    } catch (error) {
      console.error("Error deleting category:", error.response?.data || error.message);
      alert(`Error: ${JSON.stringify(error.response?.data)}`);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-accent">
      {/* Sticky Header */}
      <div className="p-6 bg-secondary flex justify-between items-center sticky top-0 z-10 shadow-md">
        <h1 className="text-2xl font-bold text-white">Categories</h1>
        <button
          onClick={createCategory}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-highlight transition"
        >
          <FiPlus className="mr-2" /> New Category
        </button>
      </div>

      {/* Scrollable Category List */}
      <div className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-4">
          {categories.length > 0 ? (
            categories.map((category) => (
              <li
                key={category.id}
                className="p-4 bg-secondary text-white rounded-lg flex justify-between items-center transition-transform duration-300 ease-out hover:scale-100 hover:shadow-md"
              >
                <span
                  onClick={() => navigate(`/categories/${category.id}`)}
                  className="cursor-pointer flex-1"
                >
                  {category.name}
                </span>
                <button
                  onClick={() => deleteCategory(category.id)}
                  className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded-lg ml-4"
                >
                  <FiTrash2 />
                </button>
              </li>
            ))
          ) : (
            <p className="text-white text-center">No categories available. Add a new category!</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CategoryPage;
