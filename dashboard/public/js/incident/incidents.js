$(function () {
  
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