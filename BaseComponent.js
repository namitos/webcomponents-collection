import { BaseComponentMixin } from './BaseComponentMixin.js';
import { render, html } from '../lit-html/lit-html.js';

export { html };
export class BaseComponent extends BaseComponentMixin(HTMLElement) {
  template() {
    throw { name: 'BaseComponentError', text: 'template() method required' };
  }

  _render() {
    render(this.template(), this._content);
  }

  render(immediate) {
    if (immediate === true) {
      this._render();
    } else {
      if (!this.rendering) {
        this.rendering = true;
        setTimeout(() => {
          this._render();
          this.rendering = false;
        }, 0);
      } else {
        // console.log(this, 'skip render');
      }
    }

    return this;
  }

  connectedCallback() {}
}
