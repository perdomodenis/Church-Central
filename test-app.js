require('@babel/register')({
  presets: ['@babel/preset-env', '@babel/preset-react'],
  ignore: [/node_modules/]
});

const React = require('react');
const ReactDOMServer = require('react-dom/server');

try {
  const App = require('./frontend/src/App').default;
  // We can't fully render without providers, but let's just see if requiring it crashes.
  console.log("App required successfully.");
} catch (e) {
  console.error("Error requiring App:", e);
}
