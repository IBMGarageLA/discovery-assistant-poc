const axios = require("axios");
const baseUrl =
  process.env.NODE_ENV === "development" ? "http://localhost:3001" : "";

console.log(process.env.NODE_ENV);
const apiInstance = axios.create({ baseURL: baseUrl });

export async function uploadFile(file, metadata = {}) {
  try {
    const form = new FormData();

    form.append("file", file);
    form.append("metadata", JSON.stringify(metadata));

    const result = await apiInstance.post("/file/upload", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return result?.data;
  } catch (error) {
    throw error;
  }
}

export async function searchText(company, text) {
  try {
    const result = await apiInstance.get("/search", {
      params: { company, text },
    });

    return result?.data;
  } catch (error) {
    throw error;
  }
}

export async function getUser() {
  try {
    const result = await apiInstance.get("/user");

    return result?.data;
  } catch (error) {
    throw error;
  }
}

export async function postFeedback(feedback) {
  try {
    const result = await apiInstance.post("/feedback", feedback);

    return result?.data;
  } catch (error) {
    throw error;
  }
}

export async function updateFeedback(docId, feedback) {
  try {
    const result = await apiInstance.put(`/feedback/${docId}`, feedback);

    return result?.data;
  } catch (error) {
    throw error;
  }
}
