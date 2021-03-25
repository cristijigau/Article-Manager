class Article {
  constructor(heading, content) {
    this._heading = heading;
    this._content = content;
  }
  get heading() {
    return this._heading;
  }

  set heading(newHeading) {
    this._heading = newHeading;
  }

  get content() {
    return this._content;
  }

  set content(newContent) {
    this._content = newContent;
  }
}

class ArticleForm extends Article {
  constructor(heading, content) {
    super(heading, content);
  }
  getInfo() {
    this._heading = document.getElementById('articleFormTitle').value;
    this._content = document.getElementById('articleFormContent').value;
  }
}

class ArticleManager {
  constructor() {
    this.articleId = 0;
  }

  showAll() {
    document.getElementById('articlesList').innerHTML = '';

    var value;
    let keys = Object.keys(localStorage),
      i = keys.length;

    while (i--) {
      if (localStorage.getItem(keys[i]) !== localStorage.getItem('total')) {
        value = JSON.parse(localStorage.getItem(keys[i]));
        let listItem = document.createElement('li');
        let id = keys[i];
        listItem.setAttribute('id', id);
        let spanTitle = document.createElement('span');
        spanTitle.classList.add('article-short');
        let title = document.createTextNode(value._heading);
        spanTitle.appendChild(title);
        let linkRead = document.createElement('a');
        let linkUpdate = document.createElement('a');
        let linkDelete = document.createElement('a');
        let linkReadText = document.createTextNode(' Read');
        let linkUpdateText = document.createTextNode(' Update');
        let linkDeleteText = document.createTextNode(' Delete');
        linkRead.appendChild(linkReadText);
        linkUpdate.appendChild(linkUpdateText);
        linkDelete.appendChild(linkDeleteText);
        linkRead.setAttribute('href', '#');
        linkUpdate.setAttribute('href', '#');
        linkDelete.setAttribute('href', '#');
        linkRead.setAttribute('onclick', 'articleManager.showArticle(event)');
        linkUpdate.setAttribute('onclick', 'articleManager.openModal(event)');
        linkDelete.setAttribute(
          'onclick',
          'articleManager.deleteArticle(event)'
        );
        let spanActions = document.createElement('span');
        spanActions.classList.add('article-actions');
        spanActions.appendChild(linkRead);
        spanActions.appendChild(linkUpdate);
        spanActions.appendChild(linkDelete);
        spanTitle.appendChild(spanActions);
        listItem.appendChild(spanTitle);
        document.getElementById('articlesList').appendChild(listItem);
      }
    }
    var modal = document.getElementById('formModal');
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = 'none';
        document.getElementById('articleFormTitle').value = '';
        document.getElementById('articleFormContent').value = '';
      }
    };
  }

  showArticle(e) {
    document.getElementById('articlesList').innerHTML = '';
    let id = e.target.parentNode.parentNode.parentNode.id;
    let value = JSON.parse(localStorage.getItem(id));
    let listItem = document.createElement('li');
    let spanTitle = document.createElement('span');
    spanTitle.classList.add('article-short');
    let title = document.createTextNode(value._heading);
    let articleParagraph = document.createElement('p');
    articleParagraph.classList.add('article-paragraph');
    let content = document.createTextNode(value._content);
    spanTitle.appendChild(title);
    articleParagraph.appendChild(content);
    listItem.appendChild(spanTitle);
    listItem.appendChild(articleParagraph);
    const backButton = document.createElement('button');
    const backButtonText = document.createTextNode('Inapoi');
    backButton.appendChild(backButtonText);
    backButton.setAttribute('onclick', 'articleManager.showAll()');
    listItem.appendChild(backButton);
    document.getElementById('articlesList').appendChild(listItem);
  }

  addArticle() {
    let form = new ArticleForm();
    form.getInfo();
    let article = new Article(form.heading, form.content);
    let total = parseInt(localStorage.getItem('total'));
    total += 1;
    localStorage.setItem(total, JSON.stringify(article));
    localStorage.setItem('total', total);
    this.showAll();
    var modal = document.getElementById('formModal');
    modal.style.display = 'none';
  }

  updateArticle() {
    let id = this.articleId;
    let form = new ArticleForm();
    form.getInfo();
    let article = new Article(form.heading, form.content);
    localStorage.setItem(id, JSON.stringify(article));
    this.showAll();
    var modal = document.getElementById('formModal');
    modal.style.display = 'none';
  }

  deleteArticle(e) {
    let id = e.target.parentNode.parentNode.parentNode.id;
    localStorage.removeItem(id);
    this.showAll();
  }

  openModal(e) {
    var modal = document.getElementById('formModal');
    if (!e) {
      if (document.getElementById('updateArticle')) this.changeButton('create');
      modal.style.display = 'block';
      document.getElementById('articleFormTitle').value = '';
      document.getElementById('articleFormContent').value = '';
    } else {
      if (document.getElementById('addArticle')) this.changeButton('update');
      let id = e.target.parentNode.parentNode.parentNode.id;
      let value = JSON.parse(localStorage.getItem(id));
      document.getElementById('articleFormTitle').value = value._heading;
      document.getElementById('articleFormContent').value = value._content;
      modal.style.display = 'block';
      this.articleId = id;
    }
  }

  changeButton(flag) {
    if (flag === 'update') {
      const addButton = document.getElementById('addArticle');
      let updateButton = document.createElement('button');
      let buttonName = document.createTextNode('Update');
      updateButton.appendChild(buttonName);
      updateButton.setAttribute('id', 'updateArticle');
      updateButton.setAttribute(
        'onclick',
        'articleManager.updateArticle(event)'
      );
      addButton.parentNode.replaceChild(updateButton, addButton);
    } else if (flag === 'create') {
      const updateButton = document.getElementById('updateArticle');
      let createButton = document.createElement('button');
      let buttonName = document.createTextNode('Salveaza');
      createButton.appendChild(buttonName);
      createButton.setAttribute('id', 'addArticle');
      createButton.setAttribute('onclick', 'articleManager.addArticle(event)');
      updateButton.parentNode.replaceChild(createButton, updateButton);
    }
  }

  // When the user clicks on <span> (x), close the modal
  closeModal() {
    var modal = document.getElementById('formModal');
    modal.style.display = 'none';
    document.getElementById('articleFormTitle').value = '';
    document.getElementById('articleFormContent').value = '';
  }
}

let articleManager = new ArticleManager();
if (!localStorage.getItem('total')) localStorage.setItem('total', 0);
