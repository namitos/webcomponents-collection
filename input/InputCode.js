import { BaseComponent, html } from '../BaseComponent.js';

export class InputCode extends BaseComponent {
  static get properties() {
    return {
      value: {
        type: String,
        value: ''
      },
      lang: {
        type: String,
        value: ''
      }
    };
  }

  template() {
    return html`
      <style>
        :host {
          display: block;
        }
        #editor {
          height: 700px;
          margin: 0 0 16px 0;
          font-size: 16px;
        }
      </style>
      <div id="editor"></div>
    `;
  }

  async connectedCallback() {
    super.connectedCallback();
    if (window.ace) {
      await this.nextTick()
      this.editor = window.ace.edit(this._content.getElementById('editor'));
      this.editor.setValue(this.value);
      this.editor.setTheme('ace/theme/monokai');
      let session = this.editor.getSession();
      let lang = this.lang || (this.schema && this.schema.lang) || 'javascript';
      session.setMode('ace/mode/' + lang);
      session.setUseWrapMode(true);
      session.on('change', () => {
        this.value = this.editor.getValue();
      });
    } else {
      console.error('window.ace undefined. connect this library global');
    }
  }
}
window.customElements.define('input-code', InputCode);
