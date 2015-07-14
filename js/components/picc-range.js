(function(exports) {

  var ELEMENT_NAME = 'picc-range';
  var CLASS_PREFIX = ELEMENT_NAME + '-';

  var LABEL_TYPES = ['min', 'max', 'lower', 'middle', 'upper'];

  exports.PICCRange = document.registerElement(ELEMENT_NAME, {
    prototype: Object.create(
      HTMLElement.prototype,
      {

        attachedCallback: {value: function() {
          var bar = this.appendChild(document.createElement('div'));
          bar.className = CLASS_PREFIX + 'bar';

          LABEL_TYPES.forEach(function(type) {
            var label = this.appendChild(document.createElement('span'));
            label.className = [
              CLASS_PREFIX + 'label',
              [CLASS_PREFIX, 'label-', type].join('')
            ].join(' ');
            label.appendChild(document.createElement('span'));
          }, this);

          this.min = getAttr(this, 'min', 0);
          this.max = getAttr(this, 'max', 1);
          this.lower = getAttr(this, 'lower', 0);
          this.middle = getAttr(this, 'middle', 0);
          this.upper = getAttr(this, 'upper', 0);

          this.update();
        }},

        attributeChangedCallback: {value: function(attr, prev, value) {
          // pass through attribute settings to properties for min,
          // max, lower and upper values
          switch (attr) {
            case 'min':
            case 'max':
            case 'lower':
            case 'middle':
            case 'upper':
              this[attr] = value;
              return;
          }
        }},

        update: {value: function() {
          var min = this.min;
          var max = this.max;

          var scale = function(v) {
            return (v - min) / (max - min);
          };

          var percent = function(v) {
            return (scale(v) * 100).toFixed(1) + '%';
          };

          var bar = this.querySelector('.' + CLASS_PREFIX + 'bar');
          bar.style.setProperty('left', percent(this.lower));
          bar.style.setProperty('right', percent(this.min + this.max - this.upper));

          LABEL_TYPES.forEach(function(type) {
            var label = this.querySelector('.' + CLASS_PREFIX + 'label-' + type);
            if (!label) return;

            var value = this[type];
            label.style.setProperty('left', percent(value));
            var span = label.querySelector('span');
            if (span) {
              span.textContent = String(Math.round(value));
            }
          }, this);

          delete this.__timeout;
        }},

        min: {
          get: function() {
            return this.__min;
          },
          set: function(value) {
            this.__min = number(value, 0);
            deferUpdate(this);
          }
        },

        max: {
          get: function() {
            return this.__max;
          },
          set: function(value) {
            this.__max = number(value, 0);
            deferUpdate(this);
          }
        },

        lower: {
          get: function() {
            return this.__lower;
          },
          set: function(value) {
            this.__lower = number(value, 0);
            deferUpdate(this);
          }
        },

        middle: {
          get: function() {
            return this.__middle;
          },
          set: function(value) {
            this.__middle = number(value, 0);
            deferUpdate(this);
          }
        },

        upper: {
          get: function() {
            return this.__upper;
          },
          set: function(value) {
            this.__upper = number(value, 0);
            deferUpdate(this);
          }
        }
      }
    )
  });

  function deferUpdate(meter, delay) {
    if (!delay) delay = 50;
    if (!meter.__timeout) {
      meter.__timeout = setTimeout(function() {
        delete meter.__timeout;
        meter.update();
      }, delay);
    }
  }

  function getAttr(node, attr, fallback) {
    return node.hasAttribute(attr)
      ? node.getAttribute(attr) || fallback
      : fallback;
  }

  function number(value, fallback) {
    var num = +value;
    return isNaN(value) ? (fallback || 0) : num;
  }

  function classify(el, classes) {
    for (var klass in classes) {
      el.classList[classes[klass] ? 'add' : 'remove'](klass);
    }
  }

})(this);
