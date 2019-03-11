import { BaseComponentMixin } from './BaseComponentMixin.js';
import { render, html } from '../lit-html/lit-html.js';

export { html };
export class BaseComponent extends BaseComponentMixin(HTMLElement) {
  template() {
    throw { name: 'BaseComponentError', text: 'template() method required' };
  }

  render() {
    if (!this.rendering) {
      this.rendering = true;
      setTimeout(() => {
        render(this.template(), this._content);
        this.rendering = false;
      }, 0);
    } else {
      // console.log(this, 'skip render');
    }
    return this;
  }

  get html() {
    return html;
  }

  connectedCallback() {
    // this.render();
  }
}
