const mongoose = require("mongoose");

const departmentSchema = mongoose.Schema(
  {
    name: { type: String, require: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Departments", departmentSchema);
