$(function () {
  let newLocation = false;
  const showIncidentTypeFormButton = document.querySelector('#showIncidentTypeForm');
  const hideIncidentTypeFormButton = document.querySelector('#hideIncidentTypeForm');
  const showLocationFormButton = document.querySelector('#showLocationForm');
  const hideLocationFormButton = document.querySelector('#hideLocationForm');
  const showItemFormButton = document.querySelector('#showItemForm');
  const hideItemFormButton = document.querySelector('#hideItemForm');

  showIncidentTypeFormButton.addEventListener('click', () => {
    changeInputType('incidentTypeSelect', 'incidentTypeForm');
  });

  hideIncidentTypeFormButton.addEventListener('click', () => {
    changeInputType('incidentTypeForm', 'incidentTypeSelect');
  });

  showLocationFormButton.addEventListener('click', () => {
    newLocation = true;
    changeInputType('locationSelect', 'locationForm');
    changeInputType('itemSelect', 'itemForm');
  });

  hideLocationFormButton.addEventListener('click', () => {
    newLocation = false;
    changeInputType('locationForm', 'locationSelect');
  });

  showItemFormButton.addEventListener('click', () => {
    changeInputType('itemSelect', 'itemForm');
  });

  hideItemFormButton.addEventListener('click', () => {
    if (newLocation) return;
    changeInputType('itemForm', 'itemSelect');
  });

  function changeInputType(toHide, toShow) {
    document.getElementById(toHide).classList.remove("d-block");
    document.getElementById(toHide).classList.add("d-none");
    
    document.getElementById(toShow).classList.remove("d-none");
    document.getElementById(toShow).classList.add("d-block");
  }

  $('#locationId').on('change', function() {
    $("#itemId option").each(function() {
        $(this).remove();
    });
    $('#itemId').prepend('<option disabled selected value></option>');

    const selected = $(this).find('option:selected').val();

    requestItems(selected);
  });

  async function requestItems(locationId) {
    const base_url = window.location.origin;
    const url = base_url + '/dashboard/item/location/' + locationId;
    const response = await fetch(url, 
      {
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    const responseJson = await response.json();
    appendItemsToSelect(responseJson.items);
  }

  function appendItemsToSelect(items) {
    items.forEach(item => {
      $('#itemId').append($('<option>', { 
          value: item.id,
          text : item.name 
      }));
    });
  }

});