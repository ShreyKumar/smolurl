import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import Home from './components/Home';
import Redirect from './components/Redirect';

it("renders without crashing", () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
  ReactDOM.unmountComponentAtNode(div)
});

it("components render without crashing", () => {
  const div = document.createElement('div')
  ReactDOM.render(<Home />, div)
  ReactDOM.unmountComponentAtNode(div)
  ReactDOM.render(<Redirect />, div)
  ReactDOM.unmountComponentAtNode(div)
});
