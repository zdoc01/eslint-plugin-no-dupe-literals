# eslint-plugin-no-dupe-literals
ESLint rules for identifying duplicate string literals.

## Why?
Typical JS minifiers, such as [UglifyJS](http://lisperator.net/uglifyjs/), don't touch string literals. For instance, running the following code through Uglify:

```js
function maybeLog(something) {
  if (something === 'a string literal') {
    console.log('a string literal');
  }

  return something || 'a string literal';
}
```

Will yield:

```js
function maybeLog(o){return"a string literal"===o&&console.log("a string literal"),o||"a string literal"}

```

If you're trying to squeeze everything you can out of your minifcation process and slim down your bundles, you can simply pull those literals into a single variable definition so Uglify can handle it appropriately:

```js
function maybeLog(something) {
  const foo = 'a string literal';

  if (something === foo) {
    console.log(foo);
  }

  return something || foo;
}
```

Will now yield:

```js
function maybeLog(o){const n="a string literal"
return o===n&&console.log(n),o||n}
```

In this simple example we saved 12 bytes. That may not seem like much, but in a large project the savings will be much greater. That's where this plugin can be useful.

## Installation
First, install ESLint:
```bash
$ npm install eslint --save-dev
```

Next, install `eslint-plugin-no-dupe-literals`:
```bash
$ npm install eslint-plugin-no-dupe-literals --save-dev
```

## Configuration
Add `no-dupe-literals` to the plugins section of your `.eslintrc`:
```js
{
  "plugins": [
    "no-dupe-literals"
  ]
}
```

Then configure the rules:
```js
{
  "rules": {
    "no-dupe-literals/in-scope": "warn"
  }
}
```

## Rules
This plugin currently only supports one rule, `in-scope`, which allows you to check for duplicate string literals at the scope level.
