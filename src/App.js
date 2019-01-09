import React, { Component } from 'react';
import './App.css';
/*
const isSearched = (searchTerm) => (item) => 
  !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
*/
const Search = ({value, onChange,onSubmit, children}) => {
  return(
    <form onSubmit={onSubmit}>
      <input type="text" value={value} onChange={onChange} />
      <button type="submit">
        {children}
      </button>
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

const Table = ({ list, onDismiss }) => {
  return (
    <div className="table">
      {list.map(item => {
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

const DEFAULT_QUERY = 'redux';
const DEFAULT_PAGE = '0';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      result : null,
      searchTerm : DEFAULT_QUERY,
    };

    this.setSearchTopstories = this.setSearchTopstories.bind(this);
    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }

  setSearchTopstories(result){
    const { hits, page } = result;

    const oldHits = page !== 0 ? this.state.result.hits : [];

    const updatedHits = [
      ...oldHits,
      ...hits
    ];

    this.setState({ 
      result: { hits: updatedHits, page }
    });
  }

  fetchSearchTopstories(searchTerm, page){
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopstories(result));
  }

  componentDidMount(){
    const { searchTerm } = this.state;
    this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
  }

  onDismiss(id){
    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({ 
      result: { ...this.state.result, hits: updatedHits }
     });
  }

  onSearchChange(event){
    this.setState({ searchTerm: event.target.value });
  }

  onSearchSubmit(event){
    const { searchTerm } = this.state;
    this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
    event.preventDefault();
  }

  render(){
    
    const { searchTerm, result } = this.state;
    const page = (result && result.page) || 0;
    if (!result) { return null; }
      return (
        <div className = "page">
          <div className = "interactions">
            <Search
              value={searchTerm}
              onChange={this.onSearchChange} 
              onSubmit={this.onSearchSubmit}
            >
            Search
            </Search>
          </div>
          { result && <Table 
            list={result.hits}
            onDismiss={this.onDismiss} 
          />
          }
          <div className="interactions">
            <button
              onClick={() => this.fetchSearchTopstories(searchTerm, page + 1)}
            >More</button>
          </div>
        </div>
      );
  }
}

export default App;