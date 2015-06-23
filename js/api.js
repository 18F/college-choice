---
# // with frontmatter, we can use {{ variable }} template tags
---
(function(exports) {
  
  var API = {
    url: '{{ site.api.baseurl }}'
  };

  API.get = function(uri, params, done) {
    console.debug('[API] get("%s", %s)', uri, JSON.stringify(params));
    if (arguments.length === 2) {
      done = params;
    } else if (params) {
      if (typeof params === 'object') {
        params = querystring.stringify(params);
      }
      uri = join([uri, params], '?');
    }
    var url = join([API.url, uri], '/');
    console.debug('[API] getting: "%s"', url);
    return d3.json(url, done);
  };

  API.load = function(uri, done) {
    var ext = uri.split('.').pop();
    var load = d3[ext || 'json'];
    return load(url, done);
  };

  API.endpoint = function(uri) {
    return function endpoint(params, done) {
      return API.get(uri, params, done);
    };
  };

  API.search = API.endpoint('{{ site.api.search }}');

  exports.API = API;

  function join(list, glue) {
    for (var i = 0; i < list.length; i++) {
      var str = String(list[i]);
      if (str.charAt(0) === glue) {
        list[i] = str.substr(1);
      } else if (str.charAt(str.length - 1) === glue) {
        list[i] = str.substr(0, str.length - 1);
      }
    }
    return list.join(glue);
  }

})(this);
