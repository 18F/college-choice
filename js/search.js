(function(exports) {

  var resultsRoot = document.querySelector('.search-results');
  var query = location.search;
  if (!query) {
    resultsRoot.classList.add('hidden');
    return;
  }

  // TODO: include formdb, querystring, and tagalong
  var form = new formdb.Form('#search-form');
  var values = querystring.parse(query.substr(1));
  removeEmptyValues(values);
  console.debug('[search] form values:', values);
  form.setData(values);

  expandAccordions(values);

  /**
   * This is our format generator. Its methods are format generators for
   * specific types of values, and they take a key in the data object to
   * format. For instance:
   *
   * @example
   * var formatFoo = format.percent('foo');
   * formatFoo({foo: 0.5}) -> '50%'
   */
  var format = (function() {
    var formatter = function(fmt, _empty) {
      if (typeof fmt === 'string') {
        fmt = d3.format(fmt);
      }
      return function(key, empty) {
        empty = empty || _empty;
        if (typeof empty === 'string') {
          empty = d3.functor(empty);
        }
        return function(d) {
          var value = d[key];
          return (!value && empty)
            ? empty.call(d)
            : fmt.call(d, +value, key);
        };
      };
    };

    return {
      dollars: formatter('$,d', '$0'),
      percent: formatter('%.0f', '--'),
      number: formatter(',d', '0'),
      plural: function(key, singular, plural) {
        if (!plural) plural = singular + 's';
        return function(d) {
          return d[key] == 1 ? singular : plural;
        };
      }
    };
  })();

  resultsRoot.classList.add('js-loading');
  API.search(values, function(error, data) {
    resultsRoot.classList.remove('hidden');
    resultsRoot.classList.remove('js-loading');

    if (error) {
      return showError(error);
    }

    console.log('loaded schools:', data);
    resultsRoot.classList.add('js-loaded');

    console.time('[render]');

    console.time('[render] template');
    // render the basic DOM template for each school
    tagalong(resultsRoot, data, {
      results_word: format.plural('total', 'Result')
    });

    d3.select(resultsRoot)
      .datum(data)
      .select('[data-bind="total"]')
        .text(format.number('total', '0'));

    var resultsList = resultsRoot.querySelector('.schools-list');
    tagalong(resultsList, data.results, {
      size: format.number('size'),
      link: {
        '@href': function(d) {
          var name = d.name.replace(/\W+/g, '-');
          return ['../school/?', d.id, '-', name].join('');
        }
      }
    });
    console.timeEnd('[render] template');

    console.time('[render] charts');
    // bind all of the data to elements in d3, then
    // call renderCharts() on the selection
    d3.select(resultsList)
      .selectAll('.school')
      .data(data.results)
      .call(renderCharts);
    console.timeEnd('[render] charts');

    console.timeEnd('[render]');
  });

  function renderCharts(selection) {
    selection.select('[data-bind="size"]')
      .text(format.number('size'));
  }

  function showError(error) {
    console.error('error:', error);
    resultsRoot.classList.add('js-error');
    var out = resultsRoot.querySelector('.error');
    out.classList.remove('hidden');
    out.textContent = String(error);
  }

  function removeEmptyValues(obj) {
    var empty = function(v) {
      return v === null || v === '';
    };
    for (var key in obj) {
      if (empty(obj[key])) {
        delete obj[key];
      }
    }
    return obj;
  }

  function expandAccordions(values) {
    for (var key in values) {
      if (values[key]) {
        var el = form.getInputsByName(key)[0];
        if (!el) {
          console.warn('no input element for parameter: "%s"', key);
          continue;
        }
        do {
          el = el.parentNode;
          if (el.classList.contains('picc-accordion')) {
            d3.select(el)
              .attr('data-expanded', 'true');
            break;
          }
        } while (el);
      }
    }
  }

})(this);
