(function($){

  /**
   * Custom selector for querying add/remove rows
   */
  $.extend($.expr[":"], {
    add_remove_row: function(el){
      return $(el).data("add-remove-row") ? true : false;
    },
    add_remove_container: function(el){
      return $(el).data("add-remove-container") ? true : false;
    }
  });

  $.fn.addRemove = function(p1, p2){

    var action = "init",
        options = p1;

    if ( typeof p1 === "string" ) {
      action = p1;
      options = p2;
    }

    return $.fn.addRemove[action].call(this, options);
  };

  /**
   * Default options
   */
  $.fn.addRemove.defaults = {

    addButton:      ".add-button",
    removeButton:   ".remove-button",
    container:      "> *:not(:button):first",
    template:       "> *:not(:button):first > *:last",
    removeTemplate: false,
    placehoolder:   null,
    maxRows:        null,
    minRows:        0,
    autoFocus:      false,
    clearValues:    true,
    modifyId:       function(oldId, rowNumber){

      if ( oldId ) {

        var newId = oldId.replace(/(-|_)\d+$/, "$1" + rowNumber)
      }
      else {

        newId = null;
      }

      return newId;
    },
    modifyName:     function(name, rowNumber){

      if ( name ) {

        var newName = name.replace(/\[[^\]]\]$/, "[" + rowNumber + "]");
      }
      else {
        newName = null;
      }

      return newName;
    }
  };

  /**
   * Get or set options for the plugin
   */
  $.fn.addRemove.options = function(options){

    var result = this;

    this.each(function(){

      var element = $(this);

      var data = element.data("addRemove");

      if ( typeof data === "undefined" ) data = {};

      var oldOptions = ( typeof data.options === "undefined" ) ? $.fn.addRemove.defaults : data.options;

      if ( typeof options === "undefined" ){
        result = oldOptions;
      }
      else {
        data.options = $.extend({}, oldOptions, options);
        element.data("addRemove", data);
      }
    });

    return result;
  };

  /**
   * Modifies the name of a row so it matches the row index
   */
  $.fn.addRemove.modifyName = function(row, rowNumber) {

    var settings = this.addRemove("options");

    row.find(":input").each(function(){

      var input   = $(this),
          oldName = input.attr("name");

      var newName = settings.modifyName(oldName, rowNumber);

      input.attr("name", newName);
    });
  }

  /**
   * Modifies the id of a row so that it matches the row index
   */
  $.fn.addRemove.modifyId = function(row, rowNumber) {

    var settings = this.addRemove("options");

    row.find("[id]").each(function(){

      var element  = $(this),
          oldId     = element.attr("id");

      var newId = settings.modifyId(oldId, rowNumber);

      element.attr("id", newId);
    });

    row.find("label[for]").each(function(){

      var element  = $(this),
          oldId     = element.attr("for");

      var newId = settings.modifyId(oldId, rowNumber);

      element.attr("for", newId);
    });
  }

  /**
   * Initializes a new row
   */
  $.fn.addRemove.initializeRow = function(row){

    var el = this;

    var settings = this.addRemove("options");

    row.data("add-remove-row", true);

    var removeButton = row.find(settings.removeButton);

    removeButton.click(function(){

      var sibs = row.siblings(":add_remove_row");

      var p = row.parent();

      row.remove();

      $.fn.addRemove.updateMinMax.call(el, sibs.length + 1);

      p.trigger("add_remove:remove", {element:row[0]});

      sibs.each(function(rowIndex){

        var row = $(this);

        $.fn.addRemove.modifyName.call(el, row, rowIndex);
        $.fn.addRemove.modifyId.call(el, row, rowIndex);

        row.trigger("add_remove:renumber");
      });

      if ( 0 === sibs.length ){
        p.trigger("add_remove:empty");
      }
    });
  };

  $.fn.addRemove.init = function(options){

     this.addRemove("options", options);

     return this.each(function(){

      var arElement   = $(this);

      var settings = arElement.addRemove("options");

       var container = arElement.find(settings.container),
          template  = arElement.find(settings.template),
          isInitialized = false,
          placeholder = settings.placeholder ? $(settings.placeholder) : null;

      container.on("add_remove:remove", function(evt){
        if ( settings.placeholder && ! container.children(":add_remove_row").length ){
          container.append(placeholder);
        }
      });

      container.data("add-remove-container", true);

      if ( settings.removeTemplate ){

        template.remove();
      }

      container.find("> *").each(function(){

        var row = $(this);

        $.fn.addRemove.initializeRow.call(arElement, row);
      });

      template = template.clone();

      var data = arElement.data("addRemove");
      data.template = template;

      if ( placeholder ) placeholder.remove();

      arElement.on("click", settings.addButton, function(){

        arElement.addRemove("addRow");
      });

      $.fn.addRemove.updateMinMax.call(arElement);

      isInitialized = true;
    });
  };

  $.fn.addRemove.updateMinMax = function(oldVal){

    return this.each(function(){

      var element = $(this),
          settings = element.addRemove("options"),
          container = element.find(":add_remove_container"),
          numRows = container.find(":add_remove_row").length;

      if ( settings.maxRows ){

        if ( settings.maxRows > numRows){

          element.find(settings.addButton).removeAttr("disabled");

          if ( typeof oldVal !== "undefined" && settings.maxRows <= oldVal){
            element.trigger("add_remove:max_clear");
          }
        }
        else {

          element.find(settings.addButton).attr("disabled", "disabled");

          if ( typeof oldVal !== "undefined" && settings.maxRows > oldVal){
            element.trigger("add_remove:max");
          }

        }
      }

      if ( typeof settings.minRows !== "undefined" ){

        if ( settings.minRows < numRows){

          container.find(settings.removeButton).removeAttr("disabled");

          if ( typeof oldVal !== "undefined" && settings.minRows >= oldVal){
            element.trigger("add_remove:min_clear");
          }
        }
        else {

          container.find(settings.removeButton).attr("disabled", "disabled");

          if ( typeof oldVal !== "undefined" && settings.minRows < oldVal){
            element.trigger("add_remove:min");
          }
        }
      }
    }
  )};

  $.fn.addRemove.addRow = function(row){

    return this.each(function(){

      var el = $(this);

      var data = el.data("addRemove");
      var template = data.template;

      var row = template.clone();

      $.fn.addRemove.initializeRow.call(el, row);

      var container = el.find(":add_remove_container");

      var settings = el.addRemove("options");

      if (settings.clearValues){
        row.find("input").val("");
      }

      var rows = container.find(":add_remove_row")

      row.appendTo(container);

      rows = rows.add(row);

      $.fn.addRemove.updateMinMax.call(el, rows.length);

      row.trigger("add_remove:add");

      rows.each(function(rowIndex){

        var row = $(this);

        $.fn.addRemove.modifyName.call(el, row, rowIndex);
        $.fn.addRemove.modifyId.call(el, row, rowIndex);

        if (settings.autoFocus) {

          row.find(":input:first").focus();
        }

        row.trigger("add_remove:renumber");
      });
    });
  };

  $.fn.addRemove.container = function(){

    var d = this.find(":add_remove_container");

    return d;
  };

}(jQuery));
