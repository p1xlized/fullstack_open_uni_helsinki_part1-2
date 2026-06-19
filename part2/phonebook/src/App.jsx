import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";
import personService from "./services/person";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterName, setFilterName] = useState("");

  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationType, setNotificationType] = useState("success"); // 'success' or 'error'

  const showNotification = (message, type = "success") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setTimeout(() => {
      setNotificationMessage(null);
    }, 5000);
  };

  useEffect(() => {
    personService.getAllPersons().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleFilterChange = (event) => setFilterName(event.target.value);

  const addPerson = (event) => {
    event.preventDefault();

    const trimmedName = newName.trim();
    const trimmedNumber = newNumber.trim();

    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === trimmedName.toLowerCase(),
    );

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${trimmedName} is already added to phonebook, replace the old number with a new one?`,
      );

      if (confirmUpdate) {
        const changedPerson = { ...existingPerson, number: trimmedNumber };

        personService
          .updatePerson(existingPerson.id, changedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((p) =>
                p.id !== existingPerson.id ? p : returnedPerson,
              ),
            );
            setNewName("");
            setNewNumber("");
            showNotification(
              `Updated number for ${returnedPerson.name}`,
              "success",
            );
          })
          .catch((error) => {
            if (
              error.response &&
              error.response.data &&
              error.response.data.error
            ) {
              showNotification(error.response.data.error, "error");
            } else {
              showNotification(
                `Information of ${existingPerson.name} has already been removed from server`,
                "error",
              );
              setPersons(persons.filter((p) => p.id !== existingPerson.id));
            }
          });
      }
      return;
    }

    const personObject = {
      name: trimmedName,
      number: trimmedNumber,
    };

    personService
      .createPerson(personObject)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
        showNotification(`Added ${returnedPerson.name}`, "success");
      })
      .catch((error) => {
        showNotification(error.response.data.error, "error");
      });
  };

  const deletePersonOf = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .removePerson(id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== id));
          showNotification(`Deleted ${name}`, "success");
        })
        .catch(() => {
          showNotification(
            `Information of ${name} has already been removed from server`,
            "error",
          );
          setPersons(persons.filter((p) => p.id !== id));
        });
    }
  };

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filterName.toLowerCase()),
  );

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notificationMessage} type={notificationType} />

      <Filter value={filterName} onChange={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm
        onSubmit={addPerson}
        nameValue={newName}
        onNameChange={handleNameChange}
        numberValue={newNumber}
        onNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons persons={personsToShow} onDelete={deletePersonOf} />
    </div>
  );
};

export default App;
