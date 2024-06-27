// src/utils/fetchUtils.js
export const fetchResponse = async (url, options) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.text();
    } catch (error) {
      console.error("Fetching error: ", error);
      throw error;
    }
  };
  