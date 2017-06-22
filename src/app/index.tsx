import React = require('react')
import * as ReactDOM from 'react-dom';
import { useStrict } from 'mobx';
import {Main} from "./main";

// enable MobX strict mode
useStrict(true);

// render react DOM
ReactDOM.render(<Main/>, document.getElementById('root'));
