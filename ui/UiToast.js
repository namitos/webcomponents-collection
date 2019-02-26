import { BaseComponent, html } from '../BaseComponent.js';

export class UiToast extends BaseComponent {
  static get properties() {
    return {};
  }
  template() {
    return html`
      <style>
        :host {
          position: fixed;
          display: block;
          background-color: #323232;
          color: #fff;
          font-weight: 600;
          margin: 12px;
          font-size: 14px;
          z-index: 1000;
          left: 0;
          bottom: 0;
          min-height: 48px;
          min-width: 288px;
          padding: 16px 24px;
          box-sizing: border-box;
          box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
          border-radius: 2px;
          font-family: 'Roboto', sans-serif;
        }
      </style>
      <div><slot></slot></div>
    `;
  }

  show() {}
}
window.customElements.define('ui-toast', UiToast);
