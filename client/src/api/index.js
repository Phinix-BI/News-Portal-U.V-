// import 'dotenv/config'

// const baseurl = process.env.baseUrl || 'http://localhost:3000';
  
const baseurl = 'http://localhost:3000';

export const url = baseurl;

export const fetchDataFromBackend = async () => {
  try {
    const response = await fetch(`${baseurl}/api/posts`); // Replace with your actual backend API endpoint
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

