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

    return this.each(function(){

      var element   = $(this);

      $.fn.addRemove.options.call(element, options);

      var settings = $.fn.addRemove.options.call(element);

      var container = element.find(settings.container),
          template  = element.find(settings.template),
          isInitialized = false,
          placeholder = settings.placeholder ? $(settings.placeholder) : null;

      container.on("add_remove:remove", function(evt){
        if ( settings.placeholder && ! container.children(":add_remove_row").length ){
          container.append(placeholder);
        }
      });

      container.data("add-remove-container", true);

      function updateMinMax(oldVal){

        var numRows = container.find(":add_remove_row").length;

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

      function initializeRow(row){

        row.data("add-remove-row", true);

        var removeButton = row.find(settings.removeButton);

        removeButton.click(function(){

          var sibs = row.siblings(":add_remove_row");

          var p = row.parent();

          row.remove();

          updateMinMax(sibs.length + 1);

          p.trigger("add_remove:remove", {element:row[0]});

          sibs.each(function(rowIndex){

            var row = $(this);

            $.fn.addRemove.modifyName(row, rowIndex);
            $.fn.addRemove.modifyId(row, rowIndex);

            row.trigger("add_remove:renumber");
          });

          if ( 0 === sibs.length ){
            p.trigger("add_remove:empty");
          }
        });
      }

      function addRow(row){

        initializeRow(row);

        if (settings.clearValues){
          row.find("input").val("");
        }

        var rows = container.find(":add_remove_row")

        row.appendTo(container);

        rows.add(row);

        updateMinMax(rows.length);

        row.trigger("add_remove:add");

        rows.each(function(rowIndex){

          var row = $(this);

          modifyName(row, rowIndex);
          modifyId(row, rowIndex);

          if (settings.autoFocus) {

            row.find(":input:first").focus();
          }

          row.trigger("add_remove:renumber");
        });
      }

      if ( settings.removeTemplate ){

        template.remove();
      }

      container.find("> *").each(function(){

        var row = $(this);

        initializeRow(row);
      });

      template = template.clone();

      element.on("click", settings.addButton, function(){

        var row = template.clone();

        if ( placeholder ) placeholder.remove();

        addRow(row);
      });

      updateMinMax();

      isInitialized = true;
    });
  };

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

  $.fn.addRemove.options = function(options){

    console.log(this);

    var data = this.data("addRemove");

    if ( typeof data === "undefined" ) data = {};

    var oldOptions = ( typeof data.options === "undefined" ) ? $.fn.addRemove.defaults : data.options;

    if ( typeof options === "undefined" ){
      return oldOptions;
    }
    else {
      data.options = $.extend({}, oldOptions, options);
      this.data("addRemove", data);
    }
  };

  /**
   * Modifies the name of a row so it matches the row index
   */
  $.fn.addRemove.modifyName = function(row, rowNumber) {

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

}(jQuery));
