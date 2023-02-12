$(function () {
  const showSearchFormButton = document.querySelector('#showSearchFormButton');

  showSearchFormButton.addEventListener('click', () => {
    changeInputType('searchButton', 'searchForm');
  });

  function changeInputType(toHide, toShow) {
    document.getElementById(toHide).classList.remove("d-block");
    document.getElementById(toHide).classList.add("d-none");
    
    document.getElementById(toShow).classList.remove("d-none");
    document.getElementById(toShow).classList.add("d-block");
  }

});