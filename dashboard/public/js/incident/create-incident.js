$(function () {
  
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
    changeInputType('locationSelect', 'locationForm');
  });

  hideLocationFormButton.addEventListener('click', () => {
    changeInputType('locationForm', 'locationSelect');
  });

  showItemFormButton.addEventListener('click', () => {
    changeInputType('itemSelect', 'itemForm');
  });

  hideItemFormButton.addEventListener('click', () => {
    changeInputType('itemForm', 'itemSelect');
  });

  function changeInputType(toHide, toShow) {
    document.getElementById(toHide).classList.remove("d-block");
    document.getElementById(toHide).classList.add("d-none");
    
    document.getElementById(toShow).classList.remove("d-none");
    document.getElementById(toShow).classList.add("d-block");
  }

});