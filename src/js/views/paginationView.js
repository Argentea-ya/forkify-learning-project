import View from './view.js';
import icons from 'url:../../img/icons.svg'; //Parcel2

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');
  _errorMessage = `Problem with pagination`;
  _message = `Success message`;

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const btnPrev = `
		<button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
			<svg class="search__icon">
			<use href="${icons}#icon-arrow-left"></use>
			</svg>
			<span>Page ${curPage - 1}</span>
		</button>`;
    const btnNext = `
	  	<button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
			<span>Page ${curPage + 1}</span>
			<svg class="search__icon">
			<use href="${icons}#icon-arrow-right"></use>
			</svg>
		</button>`;
    //Page 1, and there are other
    if (curPage === 1 && numPages > 1) return btnNext;
    //Last page
    if (curPage === numPages && numPages > 1) return btnPrev;
    //Other page
    if (curPage < numPages) return [btnPrev, btnNext].join(' ');
    //Page 1, and there are NO other
    return '';
  }

  addHandlerClick(handler) {
	this._parentEl.addEventListener('click', function(e) {
		e.preventDefault();
		const btn = e.target.closest('.btn--inline');
		if(!btn) return;
		const gotoPage = +btn.dataset.goto;
		handler(gotoPage);
	})
}
}

export default new PaginationView();
