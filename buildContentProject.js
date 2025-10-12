class ProjectDataService {
  async load() {
    const res = await fetch('./projectsData.json');
    return await res.json();
  }
}

class DomElementFactory {
  /* 
{
  "type": "p",
  "content": [
    { "type": "strong", "text": "Geo Grid" },
    { "type": "text", "text": " es una web que utiliza una " },
    { "type": "strong", "text": "API" },
    { "type": "text", "text": " para obtener las banderas. Consiste en un juego donde se muestran distintas banderas y el usuario debe colocar el nombre correcto. Además, se manejan las distintas formas en las que el usuario puede escribir la respuesta para aceptarlas como válidas." }
  ]
}
{
  "type": "list",
  "items": [
    {"type": "image", "src": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg"},
    {"type": "image", "src": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg"},
    {"type": "image", "src": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg"}
  ]
},

{
"type": "list",
  "items": [
    { "type": "contentText",
    "content" : [
      { "type": "strong", "text": "Geo Grid" },
      { "type": "text", "text": " es una web que utiliza una " },
      { "type": "strong", "text": "API" },
      { "type": "text", "text": " para obtener las banderas. Consiste en un juego donde se muestran distintas banderas y el usuario debe colocar el nombre correcto. Además, se manejan las distintas formas en las que el usuario puede escribir la respuesta para aceptarlas como válidas." }
      ]
    }
  ]
}
  */
  createText(content) {
    const fragment = document.createDocumentFragment();

    if (typeof content === "string") {
      fragment.append(content);
    }

    else if (Array.isArray(content)) {
      content.forEach(part => {
        fragment.append(this.createText(part));
      });
    }

    else if (typeof content === "object" && content !== null) {
      if (content.type === "strong") {
        const strong = document.createElement("strong");
        strong.textContent = content.text;
        fragment.append(strong);
      }
      else if (content.type === "p") {
        const p = document.createElement("p");
        p.append(this.createText(content.content));
        fragment.append(p);
      }
      else if (content.text) {
        fragment.append(content.text);
      }
    }

    return fragment;
  }


  createHeading(content, lvl, className) {
    const heading = document.createElement(`h${lvl}`);
    heading.textContent = content;
    if (className) heading.classList.add(className);
    return heading;
  }

  createParagraph(content, className) {
    const p = document.createElement('p');
    const text = this.createText(content);
    p.append(text);
    if (className) p.classList.add(className);
    return p;
  }

  createLink(href, content, className, blank = true) {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = content;
    if (blank) link.target = '_blank';
    if (className) link.classList.add(className);
    return link;
  }

  createImage(src, className) {
    const img = document.createElement('img');
    img.src = src;
    if (className) img.classList.add(className);
    return img;
  }

  createUnorderedList(className) {
    const ul = document.createElement('ul');
    if (className) ul.classList.add(className)
    return ul;
  }

  createListItem() {
    return document.createElement('li');
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

  createError404() {
    return this.createHeading('Error 404 Not Found', 1, 'error404');
  }
}

class PageRenderer {
  constructor() {
    this.elementMain = document.querySelector('.project-main');
    this.storePages = ['geogrid', 'tictactoe', 'pasapalabra'];
    this.domFactory = new DomElementFactory();
    this.dataService = new ProjectDataService();
  }

  isPageStored(pageName) {
    return this.storePages.includes(pageName);
  }

  async renderPage(currentPage) {
    if (!this.isPageStored(currentPage)) {
      const errorElement = this.domFactory.createError404();
      this.elementMain.appendChild(errorElement);
      return;
    }

    const data = await this.dataService.load();
    const pageData = data.pages.find(p => p.page === currentPage);

    pageData.data.forEach(item => {
      let element = this.renderElementFromData(item);
      this.elementMain.appendChild(element);
    });
  }

  renderUnorderList(data, className) {
    const ul = this.domFactory.createUnorderedList(className);
    data.items.forEach(item => {
      let li = this.domFactory.createListItem();
      let child = this.renderElementFromData(item);
      li.appendChild(child);
      ul.appendChild(li);
    });
    return ul;
  }

  renderElementFromData(data) {
    switch (data.type) {
      case 'title':
        return this.domFactory.createHeading(data.content, data.level, `title-lvl${data.level}`);
      case 'p':
        return this.domFactory.createParagraph(data.content, `text`);
      case 'code':
        return this.domFactory.createCodeBlock(data.content);
      case 'list':
        return this.renderUnorderList(data, 'list');
      case 'list-text':
        return this.renderUnorderList(data, 'list-descriptions');
      case 'contentText':
        return this.domFactory.createText(data.content)
      case 'image':
        return this.domFactory.createImage(data.src, 'list-item-img');
      case 'link':
        return this.domFactory.createLink(data.href, data.content, 'link');
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
  }
}

init();