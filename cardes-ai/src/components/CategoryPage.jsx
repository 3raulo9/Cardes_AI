import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";

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

  return (
    <div className="p-6 bg-accent min-h-screen"> 
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold ml-11 md:ml-0 text-white">Categories</h1> {/* 🛠️ Ensured text is visible */}
        <button
          onClick={createCategory}
          className="bg-secondary text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FiPlus className="mr-2" /> New Category
        </button>
      </div>
      <ul className="mt-4">
        {categories.map((category) => (
          <li
            key={category.id}
            onClick={() => navigate(`/categories/${category.id}`)}
            className="cursor-pointer p-4 bg-secondary text-white rounded-lg my-2"
          >
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryPage;
