import { BaseComponentMixin } from './BaseComponentMixin.js';
import { render, html } from '../lit-html/lit-html.js';

export { html };
export class BaseComponent extends BaseComponentMixin(HTMLElement) {
  template() {
    throw { name: 'BaseComponentError', text: 'template() method required' };
  }

  update() {
    render(this.template(), this._content);
  }

  nextTick() {
    return new Promise((resolve) => requestAnimationFrame(() => resolve()));
  }

  async render() {
    if (this._updating) {
      return;
    }
    this._updating = true;
    await new Promise((resolve) => requestAnimationFrame(() => resolve(this.update())));
    this._updating = false;
  }

  connectedCallback() {}
}
