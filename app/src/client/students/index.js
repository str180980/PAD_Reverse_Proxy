/**
 * Controller for the client dash page.
 */
"use strict";

import BaseEntity from "../base-controller";

import { errToast, inputMapper } from "../utils";

class Company extends BaseEntity {
  constructor(route) {
    super();
    this.currentRow = {};
    this.route = route;
    this.onSaveCompanyClick = this.onSaveCompanyClick.bind(this);
    this.onSaveEditCompanyClick = this.onSaveEditCompanyClick.bind(this);
    this.attachEvents();
  }

  async init() {
    try {
      const options = {
        url: "/dash/companies",
        method: "GET",
        accept: "text/html"
      };
      const template = await $.ajax(options);
      render(template, $("main"));
    } catch (error) {
      console.log("ERROR HERE>>\n\n");
      console.log(error);
    }
  }

  attachEvents(template) {
    this.attachBaseEvents();
    $("body")
      .on("click", "#add-students-btn", this.onOpenModalClick)
      .on("click", ".open-edit-company", this.onOpenModalEditBtnClick)
      .on("click", "#save-create-company", this.onSaveCompanyClick)
      .on("click", "#save-edit-company", this.onSaveEditCompanyClick)
      .on("click", ".delete-company", this.onDeleteModalBtnClick);
  }

  async onSaveCompanyClick(e) {
    e.preventDefault();
    try {
      const dataForm = {
        firstName: $("#firstName").val(),
        lastName: $("#lastName").val(),
        tel: $("#tel").val(),
        age: $("#age").val(),
        department: $("#deps-select").val()
      };

      const settings = {
        url: "/students",
        method: "POST",
        data: dataForm
      };
      const data = await $.ajax(settings);
      $("#modal-container").modal("close");
      $(data)
        .appendTo("tbody")
        .fadeOut(0)
        .fadeIn(2000);
    } catch (error) {
      console.log("CREATE ERROR\n\n");
      console.log(err.responseJSON);
      errToast(err);
    }
  }

  async onSaveEditCompanyClick(e) {
    e.preventDefault();
    try {
      const id = $(e.currentTarget).attr("modal-id"),
        dataForm = {
          firstName: $("#firstName").val(),
          lastName: $("#lastName").val(),
          tel: $("#tel").val(),
          age: $("#age").val(),
          department: $("#deps-select").val()
        },
        settings = {
          url: `/students/edit/${id}`,
          method: "PUT",
          data: dataForm
        },
        data = await $.ajax(settings);

      $("#modal-container").modal("close");
      $(data)
        .replaceAll(this.currentRow)
        .fadeOut(0)
        .fadeIn(2000);
    } catch (error) {
      errToast(error);
    }
  }
}

const getModalInputs = () => {
  let fields = {};
  const dataForm = new FormData(),
    companyLogo = $("#logo")[0].files[0],
    inputs = new inputMapper($(".input-field"), $(".fuelsChecked"));

  fields.company = inputs.fetchInputs();
  fields.fuels = inputs.fetchCheckB();
  dataForm.append("company-logo", companyLogo);
  dataForm.append("company", JSON.stringify(fields));

  return dataForm;
};

const render = (template, parent) => {
  $(parent).replaceWith(template);
};

export default Company;
