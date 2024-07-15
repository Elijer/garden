We can also think of these as module specifications.

# CommonJS
- Formerly ServerJS
- Synchronous
- Doesn't really work in the browser ever
- [Includes a Module Specification](https://wiki.commonjs.org/wiki/Modules/1.1)
```javascript
var someModule = require('someModule')

exports = {}
```

# AMD
- "Asynchronous Module Definition"
- Asynchronous
- Designed for a browser environment where network connection is less dependable and you may want to load multiple dependencies at once
- [A competing specification for modules, usually used in the browser](https://github.com/amdjs/amdjs-api/blob/master/AMD.md)

# RequireJS
- Probably most popular implementation of AMD
- Implements the AMD API (but wants to keep the spirit of CommonJS)
- Async
- Offers CommonJS wrappers so that CommonJS modules can be directly imported for use with RequireJS

# Browserify
Allows you to 'require' modules in the browser by bundling up all of your dependencies.
- Open source
- Javascript bundler
- Allows devs to write Node.js-style modular code and use it in the browser
- Kind of old...? Is it still relevant?
- Supports "transforms" which are kinda cool
- Webpack and Rollup competed with it back in the day
# Native ES Modules (EMS)
- Standardized into ECMAScript in 2015
- **import** and **export**
- Browser support
- Also support in Node.js
- Future proof (part of JS standard)
- Is synchronous but has an optional `import` asynchronous option!