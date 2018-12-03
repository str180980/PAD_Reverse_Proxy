"use strict";

const TOAST_DURATION = 5000,
  TOAST_COLOR = "orange darken-4";

export const ajaxRequest = (
  {
    url,
    method = "GET",
    dataType = "json",
    data,
    contentType = "application/json",
    accepts = "application/json"
  } = settings,
  onSuccess,
  onError
) => {
  if (!url) return;

  const settings = {
    url,
    method,
    dataType,
    accepts,
    headers: {
      Accept: accepts,
      "Content-Type": contentType
    }
  };

  if (data) {
    settings.data = JSON.stringify(data);
  }

  return $.ajax(settings)
    .done(onSuccess)
    .fail(err => {
      if (err.status === 401) {
        return location.reload(true);
      }
      onError(err);
    });
};

export const errToast = err =>
  Materialize.toast(err.responseJSON[0], TOAST_DURATION, TOAST_COLOR);

/**
 * Method that will try to fetch html for a modal container an open it.
 * @param {string} url the end point to request modal content.
 * @param {boolean} useParent if true will open parent modal container, otherwise will open child modal.
 */

export const fetchAndOpenModal = (
  url = null,
  useParent = true,
  containerSetter = setModalContainerContent
) => {
  if (url) {
    const options = {
      url,
      dataType: "html",
      accepts: "text/html"
    };

    ajaxRequest(
      options,
      html => containerSetter(html, useParent),
      err => {
        const error = JSON.parse(err.responseText);
        Materialize.toast(error.message, TOAST_DURATION);
      }
    );
  }
};

export class inputMapper {
  constructor(inputs = [], checkBoxes = [], selectors = []) {
    this.inputObj = {};
    this.checkBoxArr = [];
    this.inputs = inputs;
    this.selectors = selectors;
    this.checkBoxes = checkBoxes;
  }

  fetchCheckB() {
    for (const iterator of this.checkBoxes) {
      const value = $(iterator)
        .find("input:checked")
        .attr("check-id");
      //  .attr("checked")
      if (value) this.checkBoxArr.push(value);
    }

    return this.checkBoxArr;
  }

  fetchInputs() {
    let tempArr = [];
    for (const iterator of this.inputs) {
      const prop = $(iterator)
        .find("input")
        .attr("id");

      console.log("PROP HERE>>\n\n");
      console.log(prop);
      if (
        $(iterator)
          .find("input")
          .prop("disabled")
      )
        continue;
      if (prop === undefined) continue;

      const value = $(iterator)
        .find("input")
        .val()
        .trim();

      console.log("INPUTS>>\n\n");
      console.log(value);

      if (value) {
        if (this.inputObj[prop]) {
          this.inputObj[prop] += `,${value}`;
        } else this.inputObj[prop] = value;
      }
    }

    // this.selectCheckArr.forEach(selector => {
    //   this.selectObj[selector] = $(`select[id='${selector}']`).val();
    //  });

    return this.inputObj;
  }

  fetchUnitaryInputsAndIds(idAttr) {
    let tempArr = [];
    const prop = this.inputs
      .eq(0)
      .find("input")
      .attr("id");
    for (const iterator of this.inputs) {
      // const prop = $(iterator)
      //   .find("input")
      //   .attr("id");

      console.log("PROP HERE>>\n\n");
      console.log(prop);
      if (
        $(iterator)
          .find("input")
          .prop("disabled")
      )
        continue;
      //if (prop === undefined) continue;

      const value = $(iterator)
        .find("input")
        .val()
        .trim();
      const id = $(iterator)
        .find("input")
        .attr(idAttr);
      console.log("INPUTS>>\n\n");
      console.log(value);
      console.log(id);

      if (value && id) {
        tempArr.push({
          id,
          val: value
        });
      }
    }

    // this.selectCheckArr.forEach(selector => {
    //   this.selectObj[selector] = $(`select[id='${selector}']`).val();
    //  });

    return tempArr;
  }

  fetchSelects() {}
}

export const mapInputs = obj => {
  const mapInputsArray = {};

  $(obj).each(function() {
    mapInputsArray[$(this).attr("id")] = $(this).val();
  });

  return mapInputsArray;
};

export const mapDinamicInputs = (obj, arr) => {
  const mapInputsArray = [];
  $(obj).each(function() {
    let tempObj = {};
    arr.forEach(el => {
      tempObj[el] = $(this)
        .find(`input[class='${el}']`)
        .val();
    });

    mapInputsArray.push(tempObj);
  });
  return mapInputsArray;
};

export const validateNumberInput = e => {
  console.log("ON VALIDATE NUMBER HERE>>>\n\n");
  console.log(e.keyCode);
  // Allow: backspace, delete, tab, escape, enter and .
  if (
    $.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
    // Allow: Ctrl+A
    (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
    // Allow: Ctrl+C
    (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) ||
    // Allow: Ctrl+X
    (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) ||
    // Allow: home, end, left, right
    (e.keyCode >= 35 && e.keyCode <= 39) ||
    //Allow numbers and numbers + shift key
    (((e.keyCode >= 48 && e.keyCode <= 57)) ||
      (e.keyCode >= 96 && e.keyCode <= 105))
  ) {
    // let it happen, don't do anything
    return;
  }
  // Ensure that it is a number and stop the keypress
  if (
    (!e.shiftKey && (e.keyCode < 48 || e.keyCode > 57)) ||
    (e.keyCode < 96 || e.keyCode > 105)
  ) {
    e.preventDefault();
  }
};

/**
 * Set a modal container's content and opens it.
 * @param {string} html to set as modal content
 * @param {string} modalContainerSelector selector to use with jquery.
 */
const setModalContainerContent = (html, modalContainerSelector) => {
  const $modalHandler = $(modalContainerSelector);
  $modalHandler.html(html);
  $(`${modalContainerSelector} select`).material_select();
  $(`${modalContainerSelector} .char-counter`).characterCounter();
  $(".dropdown-button").dropdown();
  $("ul.tabs").tabs();
  $modalHandler.modal("open");
};
