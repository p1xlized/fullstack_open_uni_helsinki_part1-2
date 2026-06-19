import mongoose from "mongoose";

const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose.set("strictQuery", false);

mongoose.connect(url)
  .then(() => console.log("connected to MongoDB"))
  .catch(error => console.log("error connecting to MongoDB:", error.message));

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3, // Name must be at least 3 characters long
    required: true,
  },
  number: {
    type: String,
    required: true,
    validate: {
      // regex validation
      validator: function(v) {
        return v.length >= 8 && /^\d{2,3}-\d+$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number! Format must be xx-xxxxxx or xxx-xxxxxx with a minimum length of 8.`
    }
  }
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

export default mongoose.model("Person", personSchema);