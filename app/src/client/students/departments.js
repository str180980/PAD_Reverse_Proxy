/**
 * Controller for the client dash page.
 */
"use strict";

import BaseEntity from "../base-controller";
import { fetchAndOpenModal, errToast, inputMapper } from "../utils";

const INPUTS_CONTAINER = "#inputs-container";
const fuelsInputHtml = `<div class="new-fuel-input row" id="">
    <div class="input-field col s12 m12">
      <input id="fuels" placeholder="" type="text" class="validate" value="" required>
      <label for="name" class="active">Produs</label>
    </div>
  </div>`;

const sideNavInit = (html, sideNavContainer) => {
  const $sideNavHandler = $(sideNavContainer);
  $sideNavHandler.html(html);
  $(`${sideNavContainer} select`).material_select();
  $(`${sideNavContainer} .char-counter`).characterCounter();
  $(".dropdown-button").dropdown();
  $("ul.tabs").tabs();
  $("#fuel-side-trigger").sideNav("show");
};

class Fuel extends BaseEntity {
  constructor(route) {
    super(route);
    this.currentRow = {};
    this.route = route;
    this.editFuelBtn = this.editFuelBtn.bind(this);
    this.saveEditedFeulBtn = this.saveEditedFeulBtn.bind(this);
    this.deleteFuelInput = this.deleteFuelInput.bind(this);
    this.addFuelInput = this.addFuelInput.bind(this);
    this.onOpenSideNav = this.onOpenSideNav.bind(this);
    this.deleteFuelById = this.deleteFuelById.bind(this);
    this.saveAllFuels = this.saveAllFuels.bind(this);
    this.attachEvents();
  }

  async init() {
    try {
      const options = {
          url: "/dash/companies",
          method: "GET",
          accept: "text/html"
        },
        template = await $.ajax(options);
      render(template, $("tbody"));
    } catch (error) {
      errToast(err);
    }
  }

  attachEvents() {
    $("body")
      .on("click", "#add-fuels-btn", this.onOpenSideNav)
      .on("click", "#add-fuel-input", this.addFuelInput)
      .on("click", "#delete-fuel-input", this.deleteFuelInput)
      .on("click", ".edit-fuel-btn", this.editFuelBtn)
      .on("click", ".save-edit-fuel-btn", this.saveEditedFeulBtn)
      .on("click", ".delete-fuel-btn", this.deleteFuelById)
      .on("click", "#save-fuels-btn", this.saveAllFuels)
      .on("click", "#close-fuels-nav", () =>
        $("#fuel-side-trigger").sideNav("hide")
      );
  }

  onOpenSideNav(e) {
    e.preventDefault();
    try {
      console.log("OPEN SIDE NAV>>>\n\n");
      fetchAndOpenModal("/students/departments", INPUTS_CONTAINER, sideNavInit);
    } catch (error) {
      console.log("SIDE NAV ERROR!!!!\n\n");
    }
  }

  addFuelInput(e) {
    e.preventDefault();
    $(INPUTS_CONTAINER).prepend(fuelsInputHtml);
  }

  editFuelBtn(e) {
    e.preventDefault();
    $(e.currentTarget)
      .attr("class", "save-edit-fuel-btn tooltipped")
      .children("i")
      .text("done");
    const inputField = $(e.currentTarget)
      .closest(".input-field")
      .prev()
      .children("input")
      .prop({ disabled: false });
  }

  async saveEditedFeulBtn(e) {
    try {
      e.preventDefault();
      const input = $(e.currentTarget)
        .closest(".input-field")
        .prev()
        .children("input");

      const inputId = $(e.currentTarget)
        .closest(".row")
        .attr("id");
      console.log("INPUT SSHERERER>>>\n\n");
      console.log(inputId);
      console.log(input);

      const data = {
          name: input.val()
        },
        options = {
          url: `/students/departments/${inputId}`,
          method: "PUT",
          data
        };
      await $.ajax(options);
      input.prop({ disabled: true });
      $(e.currentTarget)
        .attr("class", "edit-fuel-btn tooltipped")
        .children("i")
        .text("mode_edit");
    } catch (error) {
      errToast(error);
    }
  }
  async deleteFuelById(e) {
    try {
      const inputId = $(e.currentTarget)
        .closest(".row")
        .attr("id");
      const options = {
        url: `/students/departments/${inputId}`,
        method: "DELETE"
      };

      await $.ajax(options);
      $(e.currentTarget)
        .closest(".row")
        .fadeOut(500, function() {
          $(this).remove();
        });
    } catch (error) {
      errToast(error);
    }
  }

  deleteFuelInput(e) {
    e.preventDefault();
    let firstDivInput = $(INPUTS_CONTAINER)
      .children()
      .first();
    if (firstDivInput.attr("class").includes("new-fuel-input"))
      firstDivInput.remove();
  }
  async saveAllFuels(e) {
    e.preventDefault();
    try {
      const newInputsObj = new inputMapper($(".new-fuel-input")),
        newInputs = newInputsObj.fetchInputs(),
        options = {
          url: `/students/departments`,
          method: "POST",
          accepts: "text/html",
          data: newInputs
        },
        sideNavInputs = await $.ajax(options);

      $(INPUTS_CONTAINER).replaceWith(sideNavInputs);
    } catch (error) {
      errToast(error);
    }
  }
}

const render = (template, parent) => {
  $(parent).append(template);
};

export default Fuel;
