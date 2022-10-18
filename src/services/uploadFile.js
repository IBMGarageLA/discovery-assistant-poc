const axios = require("axios");
const baseUrl =
  process.env.NODE_ENV === "development" ? "http://localhost:3001" : "";

console.log(process.env.NODE_ENV);
const apiInstance = axios.create({ baseURL: baseUrl });

async function uploadFile(file, metadata = {}) {
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

async function searchText(company, text) {
  try {
    const result = await apiInstance.get("/search", {
      params: { company, text },
    });

    return result?.data;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  uploadFile,
  searchText,
};
