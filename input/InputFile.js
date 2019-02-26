import { BaseComponent, html } from '../BaseComponent.js';

export class InputFile extends BaseComponent {
  static get properties() {
    return {
      required: {
        type: Boolean,
        value: false
      },
      autoValidate: {
        type: Boolean,
        value: false
      },
      accept: {
        type: String,
        value: 'image/jpeg,image/png,image/gif'
      },
      images: {
        type: Boolean,
        value: false
      },
      multiple: {
        type: Boolean,
        value: false
      },
      buttonText: {
        type: String,
        value: 'Добавить ещё фото'
      },
      dropzoneText: {
        type: String,
        value: 'Или перенесите их сюда'
      },
      urlPrefix: {
        type: String,
        value: ''
      }
    };
  }

  template() {
    let value;
    if (this.value) {
      value = this.multiple ? this.value : [this.value];
    } else {
      value = [];
    }

    return html`
      <style>
        input {
          display: none;
        }

        .dropzone {
          display: block;
          border: 1px dashed #ccc;
          border-radius: 3px;
          padding: 8px;
          box-sizing: border-box;
        }

        .dropzone .buttons {
          display: flex;
        }

        .dropzone .buttons button {
          border: 1px solid #888;
          background: #dedede;
          background: linear-gradient(0deg, #c5c4c4, #dedede);
          color: #222;
          font-size: 15px;
          border-radius: 2px;
          padding: 4px 8px;
          margin: 0 16px 0 0;
        }

        .dropzone .buttons .drop-label {
          flex: 1;
          display: flex;
          align-items: center;
          color: #222;
        }

        .files {
          display: flex;
          flex-wrap: wrap;
        }

        .img-wrapper {
          position: relative;
          margin: 8px 8px 0 0;
        }

        .img-wrapper .remove {
          position: absolute;
          top: 2px;
          right: 2px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 100px;
          display: inline-block;
          padding: 4px;
          line-height: 16px;
          width: 15px;
          height: 15px;
          text-align: center;
          cursor: pointer;
        }

        .img-wrapper img {
          display: block;
          max-width: 120px;
          max-height: 120px;
        }

        .img-wrapper .link {
          font-size: 12px;
        }
      </style>

      <input type="file" @change="${this._fileInputChanged.bind(this)}" accept="${this.accept}" ?multiple="${this.multiple}" />
      <div class="dropzone">
        <div class="buttons">
          <button @click="${this.selectFiles.bind(this)}">${this.buttonText}</button>
          <div class="drop-label"><span>${this.dropzoneText}</span></div>
        </div>
        <div class="files">
          ${value.map(
            (item, i) => html`
              <div class="img-wrapper">
                <a class="remove" @click="${() => this._removeFile(i)}">🞫</a>
                ${this.images
                  ? html`<img src="${this._urlPrefix(item)}" /></div>`
                  : html`
                      <a class="link" href="${this._urlPrefix(item)}">${this._urlPrefix(item).substr(-40)}</a>
                    `}
              </div>
            `
          )}
        </div>
      </div>
    `;
  }

  _urlPrefix(url) {
    return url && url.indexOf('data:') === 0 ? url : `${this.urlPrefix}${url}`;
  }

  get _fileInput() {
    return this._content.querySelector('input[type=file]');
  }

  get _dropzone() {
    return this._content.querySelector('.dropzone');
  }

  constructor() {
    super(...arguments);
    this._dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      this._dropzone.classList.add('dragover');
    });
    this._dropzone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      this._dropzone.classList.remove('dragover');
    });
    this._dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      this._dropzone.classList.remove('dragover');
      let { files } = e.dataTransfer;
      if (!this.multiple && files.length > 1) {
        // this.dispatchEvent(new CustomEvent('error', { detail: { message: 'Необходимо выбрать один файл' } }));
      } else {
        this._readFiles(files);
      }
    });
  }

  _fileInputChanged() {
    const { files } = this._fileInput;
    this._readFiles(files);
  }

  selectFiles(e) {
    e.preventDefault();
    this._fileInput.click();
  }

  _readFiles(files) {
    if (files.length) {
      let mimeTypes = this.accept.split(',');
      if (!this.value) {
        this.value = [];
      }
      [...files].forEach((file) => {
        if (mimeTypes.includes(file.type)) {
          let reader = new FileReader();
          reader.onload = (e) => {
            let { result } = e.target;
            if (this.multiple) {
              this.value.push(result);
              this.render();
            } else {
              this.value = result;
            }
          };
          reader.onerror = (e) => {
            console.error(e);
            // this.dispatchEvent(new CustomEvent('error', { detail: { message: 'Ошибка чтения файла' } }));
          };
          reader.readAsDataURL(file);
        } else {
          // this.dispatchEvent(new CustomEvent('error', { detail: { message: 'Неподходящий формат файла' } }));
        }
      });
    }
  }

  _removeFile(i) {
    this.value.splice(i, 1);
    this.render();
  }
}
window.customElements.define('input-file', InputFile);
