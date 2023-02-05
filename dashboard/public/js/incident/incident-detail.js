$(function () {
  const showNewMessageFormButton = document.querySelector('#showFormNewMessage');
  const hideNewMessageFormButton = document.querySelector('#hideFormNewMessage');

  showNewMessageFormButton.addEventListener('click', () => {
    changeInputType('buttonNewMessage', 'formNewMessage');
  });

  hideNewMessageFormButton.addEventListener('click', () => {
    changeInputType('formNewMessage', 'buttonNewMessage');
  });

  function changeInputType(toHide, toShow) {
    document.getElementById(toHide).classList.remove("d-block");
    document.getElementById(toHide).classList.add("d-none");
    
    document.getElementById(toShow).classList.remove("d-none");
    document.getElementById(toShow).classList.add("d-block");
  }
});