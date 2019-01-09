import React, { Component } from 'react';
import './App.css';

const list = [
  {
    title: 'React', url: 'https://facebook.github.io/react/', author: 'Jordan Walke', num_comments: 3, points: 4, objectID: 0,
    }, {
    title: 'Redux', url: 'https://github.com/reactjs/redux', author: 'Dan Abramov, Andrew Clark', num_comments: 2, points: 5, objectID: 1,
    }
];

const isSearched = (searchTerm) => (item) => 
  !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());

const Search = ({value, onChange, children}) => {
  return(
    <form>
      {children} <input type="text" value={value} onChange={onChange} />
    </form>
  );
}

const largeColumn = {
  width: '40%',
};

const midColumn = {
  width: '30%',
};

const smallColumn = {
  width: '10%',
};

const Button = ({
  onClick,
  className = '',
  children,
}) => {
  return (
    <button
      onClick={onClick}
      className={className}
      type="button"
    >
      {children}
    </button>
  );
}

const Table = ({ list, pattern, onDismiss }) => {
  return (
    <div className="table">
      {list.filter(isSearched(pattern)).map(item => {
        return (
        <div key={item.objectID} className="table-row">
          <span style={largeColumn}>
            <a href={item.url}>{item.title}</a>
          </span>
          <span style={midColumn}>{item.author}</span>
          <span style={smallColumn}>{item.num_comments}</span>
          <span style={smallColumn}>{item.points}</span>
          <span style={smallColumn}>
            <Button
              onClick={() => onDismiss(item.objectID)}
              className="button-inline"
            >
              Dismiss
            </Button>
          </span>
        </div>);
      })}
    </div>
  );
}
class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      list: list,
      searchTerm : '',
    };

    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  onDismiss(id){
    const isNotId = item => item.objectID !== id;
    const updatedList = this.state.list.filter(isNotId);
    this.setState({ list: updatedList });
  }

  onSearchChange(event){
    this.setState({ searchTerm: event.target.value });
  }

  render(){
    const { searchTerm, list } = this.state;
      return (
        <div className = "page">
          <div className = "interactions">
            <Search
              value={searchTerm}
              onChange={this.onSearchChange} 
            >
            Search
            </Search>
          </div>
          <Table 
            list={list} 
            pattern={searchTerm}
            onDismiss={this.onDismiss} 
          />
        </div>
      );
  }
}

export default App;