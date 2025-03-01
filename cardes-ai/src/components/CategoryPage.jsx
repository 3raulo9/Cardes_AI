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
    <div className="p-6 bg-accent min-h-screen"> 
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold ml-11 md:ml-0 text-white">Categories</h1>
        <button
          onClick={createCategory}
          className="bg-secondary text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary transition"
        >
          <FiPlus className="mr-2" /> New Category
        </button>
      </div>

      <ul className="mt-4 space-y-4">
        {categories.map((category) => (
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
        ))}
      </ul>
    </div>
  );
};

export default CategoryPage;
