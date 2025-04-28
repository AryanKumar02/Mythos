import { User } from "../context/UserContext";

export async function fetchUserApi(): Promise<User> {
  const token = localStorage.getItem("authToken");
  const response = await fetch("http://localhost:3001/api/users/profile", {
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : "",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Network response was not ok, status ${response.status}`);
  }
  const data: User = await response.json();
  console.log("User data fetched:", data.streak);
  return data;
}
