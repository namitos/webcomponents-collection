import { BaseComponent, html } from '../BaseComponent.js';

function randomColors() {
  const randomInt = (min = 0, max = 1500) => Math.floor(Math.random() * (max - min)) + min;
  let colors = [];
  for (let i = 0; i < 1000; ++i) {
    let c = `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
    colors.push(c);
  }
  return colors;
}

/** @polymerElement */

window.customElements.define(
  'chart-donut',
  class UiChartDonut extends BaseComponent {
    static get properties() {
      return {
        config: {
          type: Object,
          value: () => {
            return {
              colors: ['#93C93C', '#932C87', '#5574A6', '#DC3912', '#FF9900', '#109618', '#990099', '#3B3EAC', '#0099C6', '#DD4477', '#66AA00', '#B82E2E', '#316395', '#994499', '#22AA99', '#AAAA11', '#6633CC', '#E67300', '#8B0707', '#329262'].concat(randomColors())
            };
          }
        },
        activeElement: {
          type: Object,
          notify: true,
          value: () => {
            return {};
          }
        },
        center: {
          type: Object,
          value: () => {
            return {};
          }
        }
      };
    }

    template() {
      return html`
        <style>
          :host {
            display: block;
          }
          #rounds {
            cursor: pointer;
          }
          #rounds path {
            stroke-width: 0;
          }
          #rounds path:hover,
          #rounds path[active] {
            opacity: 0.7;
          }
          #active {
            font-size: 30px;
            font-weight: 100;
          }

          [hidden] {
            display: none !important;
          }
        </style>
        <svg id="svg" width="100%" height="100%" viewBox="-5 -5 210 210">
          <g id="rounds">
            <circle cx="100" cy="100" r="100" fill="#ccc"></circle>
            <g id="segments"></g>
            <circle id="center" cx="100" cy="100" r="80" fill="#efefef" @click="${() => this.emit('centerClick', {})}"></circle>
            <text ?hidden="${!this.activeElement.name}" id="active" x="49%" y="46%" stroke="#000">
              <tspan x="50%" text-anchor="middle">${this.activeElement.percentage ? this.activeElement.percentage.toFixed(2) : 0}%</tspan>
              <tspan x="48%" dy="1.2em" text-anchor="middle">${this.activeElement.name}</tspan>
            </text>
            <text ?hidden="${this.activeElement.name || !this.center}" id="active" x="49%" y="46%" stroke="#000">
              <tspan x="50%" text-anchor="middle">${this.center.value}</tspan>
              <tspan style="font-size: 14px;" x="48%" dy="1.2em" text-anchor="middle">${this.center.label}</tspan>
            </text>
          </g>
        </svg>
      `;
    }

    get _segments() {
      return this._content.getElementById('segments');
    }

    set data(data) {
      let segments = this._segments;
      let total = data.reduce((prev, item) => prev + (item.value || 0), 0);
      while (segments.hasChildNodes()) {
        segments.removeChild(segments.firstChild);
      }

      let startAngle = 0;
      let endAngle = 0;

      data.forEach((item, i) => {
        item.value = item.value || 0;
        item.percentage = (item.value / total) * 100;
        item.color = item.color || this.config.colors[i];
        item.angle = 360 * (item.value / total);

        startAngle = endAngle;
        endAngle = startAngle + item.angle;

        let segment = this.el('path', {
          segmentName: item.name,
          attributes: {
            d: this._arcPath(100, 100, 100, endAngle, startAngle, item.percentage),
            fill: item.color,
            stroke: item.color
          }
        });
        segments.appendChild(segment);
        segment.addEventListener('mouseover', () => {
          this.activeElement = item;
        });
        segment.addEventListener('mouseout', () => {
          this.activeElement = {};
        });
      });
    }

    el(name, properties, children) {
      let ns = 'http://www.w3.org/2000/svg';
      properties = properties || {};
      let el = document.createElementNS(ns, name);
      if (properties.attributes) {
        for (let key in properties.attributes) {
          el.setAttributeNS(null, key, properties.attributes[key]);
        }
        delete properties.attributes;
      }
      for (let key in properties) {
        el[key] = properties[key];
      }
      if (children) {
        if (typeof children == 'string') {
          el.innerHTML = children;
        } else if (children instanceof Array) {
          children.forEach((item) => {
            el.appendChild(item);
          });
        } else {
          el.appendChild(children);
        }
      }
      return el;
    }

    async connectedCallback() {
      super.connectedCallback();
    }

    _polarToCartesian(centerX, centerY, radius, angleInDegrees) {
      const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
      const x = centerX + radius * Math.cos(angleInRadians);
      const y = centerY + radius * Math.sin(angleInRadians);
      return [x, y];
    }

    _arcPath(x, y, radius, endAngle, startAngle, itemPercentage) {
      const [x1, y1] = this._polarToCartesian(radius, radius, radius, startAngle - 90);
      const [x2, y2] = this._polarToCartesian(radius, radius, radius, endAngle - 90);
      const d = 'M' + x + ',' + y + '  L' + x1 + ',' + y1 + '  A' + radius + ',' + radius + ' 0 ' + (endAngle - startAngle > 180 ? 1 : 0) + ',1 ' + this._crutch(x2, itemPercentage) + ',' + this._crutch(y2, itemPercentage) + ' z';

      return d;
    }

    //костыль нужен для отрисовки элемента со 100%
    _crutch(coordiate, itemPercentage) {
      if (itemPercentage === 100) {
        const parts = coordiate.toString().split('.');
        return parts[1] ? `${parts[0]}.${parts[1].substr(0, 5)}` : parts[0];
      } else {
        return coordiate;
      }
    }
  }
);
