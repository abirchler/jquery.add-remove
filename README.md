# jquery.add-remove
jQuery plugin for dynamically adding and removing "rows" to an element.

This project is under development and is not at a stable point.

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

