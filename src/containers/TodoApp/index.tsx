import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Header } from '../../components/Header';
import { TodoList } from '../../components/TodoList';
import { Footer } from '../../components/Footer';
import { TodoModel } from '../../models/TodoModel';
import { TodoStore, RouterStore } from '../../stores';
import { STORE_TODO, STORE_ROUTER } from '../../constants/stores';
import { TodoFilter, TODO_FILTER_LOCATION_HASH } from '../../constants/todos';
import * as style from './style.css'

export interface TodoAppProps {
  /** MobX Stores will be injected via @inject() **/
  router: RouterStore;
  todo: TodoStore;
  children: React.ReactNode[];
}

export interface TodoAppState {
  filter: TodoFilter;
}

@inject(STORE_TODO, STORE_ROUTER)
@observer
export class TodoApp extends React.Component<TodoAppProps, TodoAppState> {
    props: TodoAppProps;
    state: TodoAppState;

  constructor(props: TodoAppProps, context: any) {
    super(props, context);
    this.state = { filter: TodoFilter.ALL };
    this.handleFilter = this.handleFilter.bind(this);
  }

  componentWillMount() {
    this.checkLocationChange();
  }

  componentWillReceiveProps(nextProps: TodoAppProps, nextContext: any) {
    this.checkLocationChange();
  }

  checkLocationChange() {
    const location = this.props.router.location;
    const filter = Object.keys(TODO_FILTER_LOCATION_HASH)
      .map((key) => Number(key) as TodoFilter)
      .find((filter) => TODO_FILTER_LOCATION_HASH[filter] === (location && location.hash));
    this.setState({ filter:filter as TodoFilter });
  }

  handleFilter(filter: TodoFilter) {
    const location = this.props.router.location;
    const currentHash = location && location.hash;
    const nextHash = TODO_FILTER_LOCATION_HASH[filter];
    if (currentHash !== nextHash) {
        this.props.router.replace(nextHash);
    }
  }

  getFilteredTodo(filter: TodoFilter) {
    const todoStore = this.props[STORE_TODO] as TodoStore;
    switch (filter) {
      case TodoFilter.ACTIVE: return todoStore.activeTodos;
      case TodoFilter.COMPLETED: return todoStore.completedTodos;
      default: return todoStore.todos;
    }
  }

  render() {
    const todoStore = this.props[STORE_TODO] as TodoStore;
    const { children } = this.props;
    const { filter } = this.state;
    const filteredTodos = this.getFilteredTodo(filter);

    const footer = todoStore.todos.length ? (
      <Footer filter={filter}
        activeCount={todoStore.activeTodos.length}
        completedCount={todoStore.completedTodos.length}
        onClearCompleted={todoStore.clearCompleted}
        onChangeFilter={this.handleFilter} />
    ) : undefined;

    return (
      <div className={style.normalTodoApp} data-automation-id="TODO_ROOT">
        <Header addTodo={todoStore.addTodo} />
        <TodoList todos={filteredTodos}
          completeAll={todoStore.completeAll}
          deleteTodo={todoStore.deleteTodo}
          editTodo={todoStore.editTodo} />
        {footer}
        {children}
      </div>
    );
  }
}
