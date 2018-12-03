const Students = require("../../models/students");
const Deps = require("../../models/departments");

class StudentsClass {
  async getDeps() {
    const deps = await Deps.find();
    return deps;
  }

  async depsBulkCreate(data) {
    await Deps.collection.insert(data);
    return;
  }

  async depUpdateById(id, data) {
    return await Deps.updateOne({ _id: id }, data).exec();
  }

  async depDeleteById(id) {
    return await Deps.deleteOne({ _id: id });
  }

  async create(data) {
    const students = await Students.create(data);
    return students;
  }

  async getAll() {
    return await Students.find()
      .populate("department")
      .exec();
  }

  async getById(id) {
    return await Students.findOne({ _id: id })
      .populate("department")
      .exec();
  }

  async updateById(id, data) {
    return await Students.updateOne({ _id: id }, data).exec();
  }

  async deleteById(id) {
    return await Students.deleteOne({ _id: id }).exec();
  }
}

module.exports = new StudentsClass();
