const baseUrl = "http://localhost:3001/anecdotes";

const getAll = async () => {
  const response = await fetch(baseUrl);
  return response.json();
};

const createNew = async (content) => {
  const object = { content, votes: 0 };
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(object),
  });
  return response.json();
};

const update = async (id, newObject) => {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newObject),
  });
  return response.json();
};

const remove = async (id) => {
  await fetch(`${baseUrl}/${id}`, { method: "DELETE" });
};

export default { getAll, createNew, update, remove };
