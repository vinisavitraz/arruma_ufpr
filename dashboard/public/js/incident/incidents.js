$(function () {
  const showSearchFormButton = document.querySelector('#showSearchFormButton');
  const hideSearchForm = document.querySelector('#hideSearchForm');

  showSearchFormButton.addEventListener('click', () => {
    changeInputType('searchButton', 'searchForm');
  });

  hideSearchForm.addEventListener('click', () => {
    changeInputType('searchForm', 'searchButton');
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
    $('#itemId').prepend('<option value="0">Selecionar...</option>');

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