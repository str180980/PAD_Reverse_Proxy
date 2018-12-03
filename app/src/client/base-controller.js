import { fetchAndOpenModal, errToast } from "./utils";

const modalContainerSelector = "#modal-container";


class BaseEntity {
  constructor() {
    this.onOpenModalClick = this.onOpenModalClick.bind(this);
    this.onOpenModalEditBtnClick = this.onOpenModalEditBtnClick.bind(this);
    this.onDeleteModalBtnClick = this.onDeleteModalBtnClick.bind(this);
    this.attachBaseEvents();
  }

  attachBaseEvents() {
    $(".modal").modal();
    $(".dropdown-button").dropdown();
    $("ul.tabs").tabs();
    $("select").material_select();
    $(".tooltipped").tooltip();
    $("#fuel-side-trigger").sideNav({
      menuWidth: 450, // Default is 300
      edge: "right", // Choose the horizontal origin
      closeOnClick: false, // Closes side-nav on <a> clicks, useful for Angular/Meteor
      draggable: true // Choose whether you can drag to open on touch screens,
    });
  }

  onOpenModalClick(e) {
    e.preventDefault();
    fetchAndOpenModal(`${this.route}/add`, modalContainerSelector);
  }
  onOpenModalEditBtnClick(e) {
    const id = $(e.currentTarget).attr("id");
    this.currentRow = $(e.currentTarget).parents("tr")[0];
    fetchAndOpenModal(`${this.route}/edit/${id}`, modalContainerSelector);
  }
  async onDeleteModalBtnClick(e) {
    try {
      const id = $(e.currentTarget).attr("id");
      this.currentRow = $(e.currentTarget).parents("tr")[0];
      const options = {
        url: `/students?id=${id}`,
        method: "DELETE"
      };
      await $.ajax(options);
      $(this.currentRow).fadeOut(1000, () => {
        $(this.currentRow).remove();
      });
    } catch (error) {
      errToast(error);
    }
  }
}

export default BaseEntity;
