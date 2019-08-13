import { BaseComponent, html } from '../BaseComponent.js';

export class UiDialog extends BaseComponent {
  static get properties() {
    return {
      opened: {
        type: Boolean,
        value: false
      },
      icon: {
        type: String
      },
      title: {
        type: String
      },
      removeAfterHide: {
        type: Boolean,
        value: true
      },
      noCancelOnOutsideClick: {
        type: Boolean,
        value: true
      },
      externalStyles: {}
    };
  }

  template() {
    return html`
      <style>
        .bg {
          background: rgba(0, 0, 0, 0.6);
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: none;
        }
        .bg[opened] {
          display: block;
        }
        .wrapper {
          background: #fff;
          border-radius: 2px;
          position: fixed;
          top: 24px;
          display: none;
          flex-direction: column;
          box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
          max-width: calc(100% - 40px);
          max-height: calc(100% - 40px);
          left: calc(50% - 320px);
          width: 640px;
        }
        .wrapper[opened] {
          display: flex;
        }
        .toolbar {
          display: flex;
          height: 64px;
          line-height: 64px;
          min-height: 64px;
          padding: 0 16px;
          font-size: 20px;
          font-family: 'Roboto', serif;
        }
        .title {
          flex: 1;
        }
        .close {
          cursor: pointer;
        }
        .close svg {
          width: 24px;
          height: 24px;
          vertical-align: text-bottom;
        }
        .content {
          padding: 16px;
          overflow: auto;
        }
        @media (max-width: 768px) {
          .wrapper {
            width: 100%;
            max-width: none;
            min-width: none;
            left: 0;
            top: 0;
          }
        }
      </style>
      ${this.externalStyles || ''}
      <div ?opened="${this.opened}" class="bg"></div>
      <div ?opened="${this.opened}" class="wrapper">
        <div class="toolbar">
          <div class="title">${this.title}</div>
          <div class="close" @click="${() => this.close()}">${this.closeIcon || '⨯'}</div>
        </div>
        <div class="content"><slot></slot></div>
      </div>
    `;
  }

  open() {
    document.body.setAttribute('dialog-opened', true);
    this.opened = true;
  }

  close() {
    document.body.removeAttribute('dialog-opened');
    this.opened = false;
    if (this.removeAfterHide) {
      this.parentNode.removeChild(this);
    }
  }
}

window.customElements.define('ui-dialog', UiDialog);
