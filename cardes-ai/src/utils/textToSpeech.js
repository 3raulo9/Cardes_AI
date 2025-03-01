import axiosInstance from "./axiosInstance";
import { toast } from "react-toastify";

const handleTextToSpeech = async (text, forDownload = false) => {
  try {
    const response = await axiosInstance.post(
      "/api/text-to-speech/",
      { text },
      { responseType: "blob" }
    );

    const audioBlob = response.data;
    const audioUrl = URL.createObjectURL(audioBlob);

    if (forDownload) {
      const link = document.createElement("a");
      link.href = audioUrl;
      link.download = "audio.mp3";
      link.click();
      toast.info("Downloading audio...");
    } else {
      const audio = new Audio(audioUrl);
      audio.play();
      toast.info("Playing audio...");
    }
  } catch (error) {
    console.error("Text-to-Speech error: ", error);
    toast.error("Something went wrong with text-to-speech.");
  }
};

export default handleTextToSpeech;
