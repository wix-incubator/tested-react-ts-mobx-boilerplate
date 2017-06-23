import * as React from 'react';
import { Provider } from 'mobx-react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { App } from './containers/App';
import { TodoApp } from './containers/TodoApp';
import { TodoModel } from './models/TodoModel';
import { TodoStore, RouterStore } from './stores';
import { STORE_TODO, STORE_ROUTER } from './constants/stores';

// default fixtures for TodoStore
const defaultTodos = [
    new TodoModel('Use Mobx'),
    new TodoModel('Use React', true),
];

// prepare MobX stores
const todoStore = new TodoStore(defaultTodos);
const routerStore = new RouterStore(browserHistory);
const rootStores = {
    [STORE_TODO]: todoStore,
    [STORE_ROUTER]: routerStore
};

export const Main = () => (
    <Provider {...rootStores} >
        <Router history={browserHistory} >
            <Route path='/' component={App} >
                <IndexRoute component={TodoApp} />
            </Route>
        </Router>
    </Provider >
);
