class ProjectDataService {
  async load() {
    const res = await fetch('./projectsData.json');
    return await res.json();
  }
}

class DomElementFactory {
  createHeading(title, lvl) {
    const h = document.createElement(`h${lvl}`);
    h.textContent = title;
    h.classList.add(`title-lvl${lvl}`);
    return h;
  }

  createParagraph(text) {
    const p = document.createElement('p');
    p.textContent = text;
    p.classList.add('text');
    return p;
  }

  createCodeBlock(codeText) {
    const pre = document.createElement("pre");
    pre.classList.add('code-pre');
    const code = document.createElement("code");
    code.classList.add('language-js');
    code.textContent = codeText;
    pre.appendChild(code);
    Prism.highlightElement(code);
    return pre;
  }

  createUnorderedList() {
    const ul = document.createElement('ul');
    ul.classList.add('list');
    return ul;
  }

  createListItem() {
    return document.createElement('li');
  }

  createImage(src) {
    const img = document.createElement('img');
    img.src = src;
    img.classList.add('list-item-img');
    return img;
  }

  createLink(href, content) {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = content;
    a.target = '_blank';
    a.classList.add('link');
    return a;
  }

  createError404() {
    return this.createHeading('Error 404', 1);
  }
}

class PageRenderer {
  constructor() {
    this.elementMain = document.querySelector('.project-main');
    this.storePages = ['geogrid', 'tictactoe', 'pasapalabra'];
    this.domFactory = new DomElementFactory();
    this.dataService = new ProjectDataService();
  }

  // Verificar si existe una página en las páginas almacenadas
  isPageStored(pageName) {
    return this.storePages.includes(pageName);
  }

  // Renderizar la página actual
  async renderPage(currentPage) {
    if (!this.isPageStored(currentPage)) {
      const errorEl = this.domFactory.createError404();
      this.elementMain.appendChild(errorEl);
      return;
    }

    const data = await this.dataService.load();
    const pageData = data.pages.find(p => p.page === currentPage);

    pageData.main.forEach(item => {
      let element = this.renderElementFromData(item);
      this.elementMain.appendChild(element);
    });
  }

  renderElementFromData(data) {
    switch (data.type) {
      case 'title':
        return this.domFactory.createHeading(data.content, data.level);
      case 'p':
        return this.domFactory.createParagraph(data.content);
      case 'code':
        return this.domFactory.createCodeBlock(data.content);
      case 'list':
        const ul = this.domFactory.createUnorderedList();
        data.items.forEach(item => {
          let li = this.domFactory.createListItem();
          let child = this.renderElementFromData(item);
          li.appendChild(child);
          ul.appendChild(li);
        });
        return ul;
      case 'image':
        return this.domFactory.createImage(data.src);
      case 'link':
        return this.domFactory.createLink(data.href, data.content);
      default:
        return this.domFactory.createError404();
    }
  }
}

function initProjectPage(namePage) {
  const pageRenderer = new PageRenderer();
  pageRenderer.renderPage(namePage);
}

function getPageFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('page');
}

function init() {
  const pageName = getPageFromUrl();
  if (pageName) {
    initProjectPage(pageName);
  } else {
    initProjectPage('geogrid');
  }
}

init();