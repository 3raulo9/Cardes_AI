import axios from "axios";

const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY; 
export async function searchYouTube(query) {

  try {
    const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        part: "snippet",
        maxResults: 1,
        q: query,
        key: API_KEY, 
      },
    });
    return response.data.items;
  } catch (error) {
    console.error("YouTube API error:", error);
    return [];
  }
}
