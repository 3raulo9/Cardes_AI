import axiosInstance from "./axiosInstance";
import { toast } from "react-toastify";

const handleTextToSpeech = async (text, forDownload = false, slow = false) => {
  try {
    // Use the correct API endpoint
    const endpoint = slow ? "/api/text-to-speech-slow/" : "/api/text-to-speech/";

    const response = await axiosInstance.post(
      endpoint,
      { text },
      { responseType: "blob" }
    );

    const audioBlob = response.data;
    const audioUrl = URL.createObjectURL(audioBlob);

    if (forDownload) {
      const link = document.createElement("a");
      link.href = audioUrl;
      link.download = slow ? "audio_slow.mp3" : "audio.mp3";
      link.click();
      toast.info(`Downloading ${slow ? "slow " : ""}audio...`);
    } else {
      const audio = new Audio(audioUrl);
      audio.play();
      toast.info(`Playing ${slow ? "slow " : ""}audio...`);
    }
  } catch (error) {
    console.error("Text-to-Speech error: ", error);
    toast.error("Something went wrong with text-to-speech.");
  }
};

export default handleTextToSpeech;