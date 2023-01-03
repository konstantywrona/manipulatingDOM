/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  ('use strict');

  const select = {
    templateOf: {
      bookTemplate: '#template-book',
    },
    books: {
      bookList: '.books-list',
      bookImage: 'book__image',
      bookImageId: 'data-id',
    },
    all: {
      bookType: '.filters',
      filtersInputs: '.filters input',
    },
    class: {
      favorite: 'favorite',
      hidden: 'hidden',
    },
  };

  const templates = {
    menuBooks: Handlebars.compile(
      document.querySelector(select.templateOf.bookTemplate).innerHTML
    ),
  };

  class BooksList {
    constructor() {
      this.favoriteBooks = [];
      this.filters = [];

      this.initData();
      this.render();
      this.getElements();
      this.initActions();
    }

    initData() {
      this.data = dataSource.books;
    }

    render() {
      for (const book of this.data) {
        book.ratingBgc = this.determineRatingBgc(book.rating);
        book.ratingWidth = book.rating * 10;

        const generatedHTML = templates.menuBooks(book);
        const bookHTML = utils.createDOMFromHTML(generatedHTML);
        const listContainer = document.querySelector(select.books.bookList);
        listContainer.appendChild(bookHTML);
      }
    }

    getElements() {
      this.dom = {};
      this.dom.books = document.querySelector(select.books.bookList);
      this.dom.typeOfBook = document.querySelector(select.all.bookType);
      this.dom.filterInput = document.querySelectorAll(
        select.all.filtersInputs
      );
    }

    initActions() {
      /* Display clicked element */
      this.dom.books.addEventListener('click', (event) => {
        console.log(event.target);
        event.preventDefault();
      });

      /* Add doubled clicked element to favorites */
      this.dom.books.addEventListener('dblclick', (event) => {
        if (
          event.target.offsetParent.classList.contains(select.books.bookImage)
        ) {
          event.preventDefault();
          const bookId = event.target.offsetParent.getAttribute(
            select.books.bookImageId
          );
          event.target.offsetParent.classList.toggle(select.class.favorite);
          if (!this.favoriteBooks.includes(bookId)) {
            this.favoriteBooks.push(bookId);
          } else {
            this.favoriteBooks.splice(this.favoriteBooks.indexOf(bookId), 1);
          }
        }
      });

      /* Add filters */

      this.dom.typeOfBook.addEventListener('click', (event) => {
        console.log(event.target);
        if (
          event.target.tagName == 'INPUT' &&
          event.target.type == 'checkbox' &&
          event.target.name == 'filter'
        ) {
          if (event.target.checked) {
            this.filters.push(event.target.value);
          } else {
            this.filters.splice(this.filters.indexOf(event.target.value), 1);
          }
        }
        for (let input of this.dom.filterInput) {
          input.addEventListener('change', this.filterBooks());
        }
      });
    }

    filterBooks() {
      for (let bookData of this.data) {
        let shouldBeHidden = false;

        for (let filter of this.filters) {
          if (!bookData.details[filter]) {
            shouldBeHidden = true;
            break;
          }
        }

        const bookImage = document.querySelector(
          '.book__image[data-id="' + bookData.id + '"]'
        );

        if (shouldBeHidden == true) {
          bookImage.classList.add(select.class.hidden);
        } else if (shouldBeHidden == false) {
          bookImage.classList.remove(select.class.hidden);
        }
      }
    }

    determineRatingBgc(rating) {
      let ratingBgc = '';
      if (rating < 6) {
        ratingBgc = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%';
      } else if (rating > 6 && rating <= 8) {
        ratingBgc = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%';
      } else if (rating > 8 && rating <= 9) {
        ratingBgc = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%';
      } else if (rating > 9) {
        ratingBgc = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%';
      }

      return ratingBgc;
    }
  }

  const app = new BooksList();
  console.log(app);
}
