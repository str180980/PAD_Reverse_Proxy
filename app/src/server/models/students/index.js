const mongoose = require("mongoose");

const studentsSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
    tel: { type: String, required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Departments" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Students", studentsSchema);
