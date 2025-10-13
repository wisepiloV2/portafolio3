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

async function loadComponent(id, filePath) {
  const container = document.querySelector(id);
  const response = await fetch(filePath);
  const html = await response.text();
  container.innerHTML = html;
}

loadComponent(".header-container", "/footer_header/header.html");
loadComponent(".footer-container", "/footer_header/footer.html");