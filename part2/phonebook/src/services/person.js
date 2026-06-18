import axios from "axios";
const baseUrl = '/api/persons'

const getAllPersons = () => {
  return axios.get(baseUrl).then((response) => response.data);
};

const createPerson = (newObject) => {
  return axios.post(baseUrl, newObject).then((response) => response.data);
};

const updatePerson = (id, newObject) => {
  return axios
    .put(`${baseUrl}/${id}`, newObject)
    .then((response) => response.data);
};

const removePerson = (id) => {
  return axios.delete(`${baseUrl}/${id}`).then((response) => response.data);
};

export default { getAllPersons, createPerson, updatePerson, removePerson };
