function goToHome() {
  window.location.href = "/index.html";
}

function goToAboutMe() {
  window.location.href = "#"
}

function goToContact() {
  window.location = "#footer"
}

function goToInit() {
  window.location = "#header"
}

fetch("/footer_header/footer.html")
  .then(response => response.text())
  .then(data => {
    document.querySelector(".footer-container").innerHTML = data;
  });


fetch("/footer_header/header.html")
  .then(response => response.text())
  .then(data => {
    document.querySelector(".header-container").innerHTML = data;

    const btnsHeader = document.querySelectorAll('.header-item');

  });