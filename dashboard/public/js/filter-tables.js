$(function () {
  $('#registers-per-page').on('change', function() {
      const selected = $(this).find('option:selected');
      let uri = selected.data('url'); 

      const params = Object.fromEntries(new URLSearchParams(window.location.search).entries());
      const queryString = buildQueryString(params);
      
      let uriRedirect = uri;

      if (queryString !== null && queryString !== '') {
          uriRedirect += '&' + queryString;
      }
      
      location.assign(uriRedirect);
  });

  function buildQueryString(params) {
      var str = [];

      for (var p in params) {
          if (p !== 'limit' && p !== 'skip' && params.hasOwnProperty(p)) {
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(params[p]));
          }
      }
      
      return str.join("&");
  }
});