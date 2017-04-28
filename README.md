# jquery.add-remove
jQuery plugin for dynamically adding and removing "rows" to an element.

**This project is under development and is not at a stable point.**

## To Do ##
- [ ] Add option to remove template
- [ ] Add option to use template from not within the container
- [ ] Add option to add add & remove buttons
- [ ] Add min-rows option
- [ ] Add max-rows option
- [ ] Handle nested instances
- [ ] Handle renaming of input elements
- [ ] Handle ids to avoid duplicates
- [ ] Add hooks & callbacks
- [ ] Add ability to confirm removal

## Example Usage ##

### HTML ###
```html
<form>
  <div id="container">

    <ul>
      <li>

        <span>
          <label for="test-field-1">Test Field</label>
          <input type="text" id="test-field-1" name="test_field[1]"/>
        </span>

        <button class="remove-button" type="button">Remove</button>

      </li>
    </ul>

    <button type="button" id="add-button" class="add-button">Add</button>

  </div>

</form>
```

### JavScript ###
```javascript
jQuery(function($){
  $("#container").addRemove();
});
```

