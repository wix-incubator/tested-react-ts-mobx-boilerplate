import * as React from 'react';
import { Provider } from 'mobx-react';
import { Router, Route, Switch } from 'react-router';
import { App } from './containers/App';
import { TodoModel } from './models/TodoModel';
import { TodoStore, RouterStore } from './stores';
import { STORE_TODO, STORE_ROUTER } from './constants/stores';
import { createBrowserHistory } from 'history';

// default fixtures for TodoStore
const defaultTodos = [
    new TodoModel('Use Mobx'),
    new TodoModel('Use React', true),
];

// prepare MobX stores
const history = createBrowserHistory();
const todoStore = new TodoStore(defaultTodos);
const routerStore = new RouterStore(history);
const rootStores = {
    [STORE_TODO]: todoStore,
    [STORE_ROUTER]: routerStore
};

export const Main = () => (
    <Provider {...rootStores} >
        <Router history={history} >
            <Switch>
                <Route path="/" component={App} >
                </Route>
            </Switch>
        </Router>
    </Provider >
);
