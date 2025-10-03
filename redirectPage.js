const projects = document.querySelectorAll('.project-container');

projects.forEach(project => {
  project.addEventListener('click', () => {
    const pageName = project.dataset.page;
    goToProject(pageName);
  });
});

function goToProject(pageName) {
  window.location.href = `project.html?page=${pageName}`;
}

