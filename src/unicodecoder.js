function getCharacters() {
  var value = document.getElementById('input').value;
  this.characters = value ? value.split('') : [];
}

function unicodePad(value) {
  // new variable needed to keep coercion to base16 during concatenation
  var b16 = base16(value);
  switch (b16.length)
  {
    case 2:
      return '00' + b16;
    case 3:
      return '0' + b16;
    default:
      return b16;
  }
}

function base16(value) {
  return value.toString(16).toUpperCase();
}

/** Crockford's string.proto.supplant **/
if (typeof String.prototype.supplant !== 'function') {
  String.prototype.supplant = function(o) {
    return this.replace(/{([^{}]*)}/g,
      function (a, b) {
          var r = o[b];
          return typeof r === 'string' || typeof r === 'number' ? r : a;
      }
    );
  };
}

(function() {
  var templateStart =
    '<div id="unicodecoder-template">' +
      '<link rel="stylesheet" href="src/unicodecoder.css">' +
      '<input id="input" type="text">' +
      '<table></table></div>';

  var template = '<td>{character}</td>';

  xtag.register('x-unicodecoder', {
    lifecycle: {
      created: function() {
        var start = xtag.createFragment(templateStart);
        this.appendChild(start);
      },
      inserted: function() {
      },
      removed: function() {
      },
      attributeChanged: function(attr, oldVal, newVal) {}
    },
    events: {
      'keyup:delegate(input)': function(event) {
        var root = event.currentTarget;
        var self = this;

        setTimeout(function() {
          var templateBody = '<tr>';
          self.value.split("").forEach(function(item) {
            templateBody = templateBody +
            template.supplant({ character: item });
          });
          templateBody = templateBody + '</tr><tr>';
          self.value.split("").forEach(function(item) {
            templateBody = templateBody +
            template.supplant({ character: root.code(item) });
          });
          templateBody = templateBody + '</tr><tr>';
          self.value.split("").forEach(function(item) {
            templateBody = templateBody +
            template.supplant({ character: root.hex(root.code(item)) });
          });
          templateBody = templateBody + '</tr><tr>';
          self.value.split("").forEach(function(item) {
            templateBody = templateBody +
            template.supplant({ character: root.htmlEntity(root.code(item)) });
          });
          templateBody = templateBody + '</tr><tr>';
          self.value.split("").forEach(function(item) {
            templateBody = templateBody +
            template.supplant({ character: root.htmlEntity(root.hex(root.code(item))) });
          });
          templateBody = templateBody + '</tr><tr>';
          self.value.split("").forEach(function(item) {
            templateBody = templateBody +
            template.supplant({ character: root.escSeq(root.code(item)) });
          });
          templateBody = templateBody + '</tr><tr>';
          self.value.split("").forEach(function(item) {
            templateBody = templateBody +
            template.supplant({ character: root.codeValue(root.code(item)) });
          });
          templateBody = templateBody + '</tr>';

          root.querySelector('table').innerHTML = templateBody;
        }, 1);
      }
    },
    accessors: {
    },
    methods: {
      code: function(value) {
          return value.charCodeAt(0);
      },
      hex: function(value) {
        return '0x' + base16(value);
      },
      htmlEntity: function(value) {
        var prepend = '&amp;#';

        if(value[0]=='0' && value[1]=='x')
          return prepend + value.slice(1);

        return prepend + value;
      },
      codeValue: function(value) {
        return 'U+' + unicodePad(value);

      },
      escSeq: function(value) {
        return '\\u' + unicodePad(value);
      }
    }
  });
})();