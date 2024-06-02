import axios from "axios";

const fetchContacts = async (accessToken) => {
  try {
    const fields = ["names", "emailAddresses", "phoneNumbers"];
    const result = await axios.get(
      `https://people.googleapis.com/v1/people/me/connections?personFields=${fields}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }
    );
    return result.data.connections || [];
  } catch (err) {
    console.error("Error fetching contacts data: ", err);
    return [];
  }
};

export default fetchContacts;
