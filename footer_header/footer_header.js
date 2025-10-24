function goToHome() {
  window.location.href = "/index.html";
}

/** 
 * @param {string} targetId 
 */
function scrollToTarget(targetId) {
  const targetElement = document.querySelector(targetId);

  if (targetElement) {
    targetElement.scrollIntoView({
      behavior: 'smooth', 
      block: 'start'       
    });
  } else {
    console.error(`Elemento con ID ${targetId} no encontrado para el scroll.`);
    window.location.href = targetId;
  }
}


async function loadComponent(id, filePath) {
  const container = document.querySelector(id);
  
  if (container) {
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
          throw new Error(`Error al cargar el componente: ${response.statusText}`);
      }
      const html = await response.text();
      container.innerHTML = html;

      if (id === ".header-container") {
                setupThemeToggle(); 
            }
      
      if (id === ".footer-container") {
          setupSmoothScrollListeners();
      }

    } catch (error) {
        console.error(`Fallo en la carga del componente ${filePath}:`, error);
    }
  } else {
      console.warn(`Contenedor ${id} no encontrado en el DOM.`);
  }
}


function setupSmoothScrollListeners() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            
            if (href === '#' || href === '#top') {
              e.preventDefault();
              scrollToTarget('body');
            } else if (href.length > 1) {
              
              e.preventDefault();
              scrollToTarget(href);
            }
        });
    });
}

loadComponent(".header-container", "/footer_header/header.html"); 
loadComponent(".footer-container", "/footer_header/footer.html");

function setupThemeToggle() {
    const toggleButton = document.getElementById('btn_theme');
    const body = document.body;
    
    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            body.classList.toggle('dark-theme');
            
            const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
            localStorage.setItem('theme', currentTheme);

            const moonIcon = document.querySelector('.moon-icon');
            const sunIcon = document.querySelector('.sun-icon');

            if (body.classList.contains('dark-theme')) {
                moonIcon.style.display = 'none';
                sunIcon.style.display = 'block';
            } else {
                moonIcon.style.display = 'block';
                sunIcon.style.display = 'none';
            }
        });
    } else {
        console.error("Error: El botón de tema (#btn_theme) no se encontró después de cargar el header.");
    }
}