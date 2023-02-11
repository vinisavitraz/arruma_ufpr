$(function () {
  $('#registers-per-page').on('change', function() {
      const selected = $(this).find('option:selected');
      let uri = selected.data('url'); 
      
      location.assign(uri);
  });
});