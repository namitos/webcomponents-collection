import { BaseComponent, html } from '../BaseComponent.js';

export class UiPager extends BaseComponent {
  static get properties() {
    return {
      page: {
        type: Number,
        value: 0,
        notify: true
      },
      pagesCount: {
        type: Number,
        value: 0
      },
      viewPagesDiapazone: {
        type: Number,
        value: 2
      }
    };
  }

  template() {
    let allPagesCount = this.pagesCount - 1;
    let visiblePages = this.viewPagesDiapazone * 2 + 1;
    if (allPagesCount < visiblePages) {
      visiblePages = allPagesCount + 1;
    }

    let startPage = this.page - this.viewPagesDiapazone;

    if (this.page + this.viewPagesDiapazone > allPagesCount) {
      startPage = allPagesCount - this.viewPagesDiapazone;
    }
    if (this.page + this.viewPagesDiapazone * 2 > allPagesCount) {
      startPage = allPagesCount - this.viewPagesDiapazone * 2;
    }

    if (startPage < 0) {
      startPage = 0;
    }
    let pages = [];
    for (let i = 0; i < visiblePages; i++) {
      let page = startPage + i;
      pages.push(
        html`
          <a ?active="${this.page === page}" @click="${() => (this.page = page)}">${page + 1}</a>
        `
      );
    }
    return html`
      <style>
        :host {
          user-select: none;
          margin: 0 0 16px 0;
          display: block;
        }

        a {
          display: inline-block;
          background: #ccc;
          width: 32px;
          height: 32px;
          text-align: center;
          line-height: 32px;
          vertical-align: top;
          border-radius: 100px;
          color: #000;
          font-size: 15px;
          cursor: pointer;
        }
        a[active] {
          font-weight: 600;
          background: #ff9800;
        }
        a svg {
          width: 24px;
          height: 24px;
          margin: 4px 0 0 0;
        }
        .arrow {
          font-size: 23px;
        }

        [hidden] {
          display: none;
        }
      </style>
      <a class="arrow" ?hidden="${this.page <= 0}" @click="${() => this.prev()}">${this.chevronLeft || '‹'}</a>
      ${pages}
      <a class="arrow" ?hidden="${this.page >= allPagesCount}" @click="${() => this.next()}">${this.chevronRight || '›'}</a>
    `;
  }

  next() {
    if (this.page < this.pagesCount) {
      this.page++;
    }
  }

  prev() {
    if (this.page > 0) {
      this.page--;
    }
  }
}
window.customElements.define('ui-pager', UiPager);
