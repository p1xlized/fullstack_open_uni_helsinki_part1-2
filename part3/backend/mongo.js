import "dotenv/config";
import mongoose from "mongoose";

const url = process.env.MONGODB_URI;

if (!url) {
  console.error("Error: MONGODB_URI is not defined in your .env file");
  process.exit(1);
}

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 2) {
  console.log("phonebook:");
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}

if (process.argv.length > 2) {
  const name = process.argv[2];
  const number = process.argv[3];

  if (!number) {
    console.log("Please provide both a name and a phone number.");
    mongoose.connection.close();
    process.exit(1);
  }

  const person = new Person({
    name: name,
    number: number,
  });

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
