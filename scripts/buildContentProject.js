class ProjectDataService {
  async load() {
    const res = await fetch("/data/projectsData.json");
    return await res.json();
  }
}

class DomElementFactory {
  /**
   * * @param {string | Array<object>} content
   * @returns {DocumentFragment}
   */
  createText(content) {
    const fragment = document.createDocumentFragment();
    if (typeof content === "string") {
      fragment.append(content);
    } else if (Array.isArray(content)) {
      content.forEach((part) => {
        if (typeof part === "object" && part !== null && part.text) {
          let element;
          const textNode = part.text;

          switch (part.format) {
            case "strong":
              element = document.createElement("strong");
              break;
            case "em":
              element = document.createElement("em");
              break;
            case "code":
              element = document.createElement("code");
              break;
            default:
              fragment.append(textNode);
              return;
          }
          element.textContent = textNode;
          fragment.append(element);
        } else if (typeof part === "string") {
          fragment.append(part);
        }
      });
    }

    return fragment;
  }

  /**
   * * @param {string | Array<object>} content
   * @param {number} lvl
   * @param {string} className
   * @returns {HTMLHeadingElement}
   */
  createHeading(content, lvl, className) {
    const heading = document.createElement(`h${lvl}`);
    const textFragment = this.createText(content);
    heading.append(textFragment);
    if (className) heading.classList.add(className);
    return heading;
  }

  /**
   * * @param {string | Array<object>} content
   * @param {string} className
   * @returns {HTMLParagraphElement}
   */
  createParagraph(content, className) {
    const p = document.createElement("p");
    const text = this.createText(content);
    p.append(text);
    if (className) p.classList.add(className);
    return p;
  }

  createLink(href, content, className, blank = true) {
    const link = document.createElement("a");
    link.textContent = typeof content === "string" ? content : "Link";
    link.href = href;
    if (blank) link.target = "_blank";
    if (className) link.classList.add(className);
    return link;
  }

  createImage(src, className) {
    const img = document.createElement("img");
    img.src = src;
    if (className) img.classList.add(className);
    return img;
  }

  createUnorderedList(className) {
    const ul = document.createElement("ul");
    if (className) ul.classList.add(className);
    return ul;
  }

  createListItem(content) {
    const li = document.createElement("li");
    const textFragment = this.createText(content);
    li.append(textFragment);
    return li;
  }

  createCodeBlock(codeText) {
    const pre = document.createElement("pre");
    pre.classList.add("code-pre");
    const code = document.createElement("code");
    code.classList.add("language-js");
    code.textContent = codeText;
    pre.appendChild(code);
    if (typeof Prism !== "undefined" && Prism.highlightElement) {
      Prism.highlightElement(code);
    }
    return pre;
  }

  createError404() {
    return this.createHeading("404 - Página no encontrada", 1, "error404");
  }
}

class PageRenderer {
  constructor() {
    this.elementMain = document.querySelector(".project-main");
    this.storePages = ["wisepilogames", "wisepiloblogs"];
    this.domFactory = new DomElementFactory();
    this.dataService = new ProjectDataService();
  }

  isPageStored(pageName) {
    return this.storePages.includes(pageName);
  }

  async renderPage(currentPage) {
    if (!this.isPageStored(currentPage)) {
      this.elementMain.innerHTML = "";
      const errorElement = this.domFactory.createError404();
      this.elementMain.appendChild(errorElement);
      return;
    }

    try {
      const data = await this.dataService.load();
      const pageData = data.pages.find((p) => p.page === currentPage);

      if (!pageData) {
        this.elementMain.innerHTML = "";
        this.elementMain.appendChild(this.domFactory.createError404());
        return;
      }

      this.elementMain.innerHTML = "";

      pageData.data.forEach((item) => {
        let element = this.renderElementFromData(item);
        if (element) {
          this.elementMain.appendChild(element);
        }
      });
    } catch (error) {
      console.error("Error al cargar o renderizar la página:", error);
      this.elementMain.innerHTML = "<h2>Error al cargar el contenido.</h2>";
    }
  }

  /**
   * @param {object} data
   * @param {string} className
   * @returns {HTMLUListElement}
   */
  renderUnorderList(data, className) {
    const ul = this.domFactory.createUnorderedList(className);

    data.items.forEach((item) => {
      let li;
      if (item.type === "image" || item.type === "link") {
        li = this.domFactory.createListItem();
        let childElement = this.renderElementFromData(item);
        li.appendChild(childElement);
      } else {
        li = this.domFactory.createListItem(item.content);
      }

      if (li) {
        ul.appendChild(li);
      }
    });
    return ul;
  }

  /**
   * @param {object} data
   * @returns {HTMLElement}
   */
  renderElementFromData(data) {
    switch (data.type) {
      case "title":
        return this.domFactory.createHeading(
          data.content,
          data.level,
          `title-lvl${data.level}`
        );
      case "p":
        return this.domFactory.createParagraph(data.content, `text`);
      case "code":
        return this.domFactory.createCodeBlock(data.content, data.language);
      case "list":
        return this.renderUnorderList(data, "list");
      case "list-text":
        return this.renderUnorderList(data, "list-text");
      case "image":
        return this.domFactory.createImage(data.src, "list-item-img");
      case "link":
        return this.domFactory.createLink(data.href, data.content, "link");
      case "li":
        return this.domFactory.createListItem(data.content);
      default:
        console.warn(`Tipo de elemento desconocido: ${data.type}`);
        return null;
    }
  }
}

function initProjectPage(namePage) {
  const pageRenderer = new PageRenderer();
  pageRenderer.renderPage(namePage);
}

function getPageFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("page");
}

function init() {
  const pageName = getPageFromUrl();
  if (pageName) {
    initProjectPage(pageName);
  }
}

init();
