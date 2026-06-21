const baseUrl = "/api/users";

const getAll = async () => {
  const response = await fetch(baseUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch user metrics");
  }
  return response.json();
};

export default { getAll };
