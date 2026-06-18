const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("frontend"));

// body logger for POST requests
morgan.token("body", (req) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return "";
});

// tiny config
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// get all persons
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

// get info about
app.get("/info", (request, response) => {
  const entriesCount = persons.length;
  const currentTime = new Date();

  response.send(`
    <p>Phonebook has info for ${entriesCount} people</p>
    <p>${currentTime}</p>
  `);
});

// get person by id
app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((p) => p.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

// delete user
app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((p) => p.id !== id);
  response.status(244).end();
});

// add user
app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }

  const nameExists = persons.some(
    (p) => p.name.toLowerCase() === body.name.toLowerCase(),
  );
  if (nameExists) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }
  const randomId = Math.floor(Math.random() * 10000000).toString();

  const newPerson = {
    id: randomId,
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(newPerson);
  response.json(newPerson);
});

// unknown endppoint
app.use((request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
});

app.listen(3000, () => {
  console.log(`Server running on port 3000`);
});
