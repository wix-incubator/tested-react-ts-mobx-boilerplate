import * as React from 'react';
import {TodoApp} from "../TodoApp/index";
const AppComponent = TodoApp as any;

export class App extends React.Component<any, any> {

  renderDevTool() {
    if (process.env.NODE_ENV !== 'production') {
      const DevTools = require('mobx-react-devtools').default;
      return (<DevTools />);
    }
    return undefined; //dummy
  };

  render() {
    return (
      <div className="container">
          <AppComponent></AppComponent>
        {this.renderDevTool()}
      </div>
    );
  }
}
