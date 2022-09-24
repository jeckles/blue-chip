import React, { Component, useEffect } from 'react';
import TextField from "@mui/material/TextField";
import { withStyles } from '@material-ui/styles'; 
import './SearchBar.css';

const CssTextField = withStyles({
    root: {
      '& label.Mui-focused': {
        color: '#61dafb',
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: '#61dafb',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: '#61dafb;',
        },
        '&:hover fieldset': {
          borderColor: '#61dafb',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#61dafb',
        },
      },
    },
  })(TextField);

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { text: '', searching: false, ticker: [], data: '' };
        this.handleChange = this.handleChange.bind(this);
        this.onEnterSearch = this.onEnterSearch.bind(this);
    }

    render() {
        return (
            <div className="main">
                <h1 className="title">Blue Chip</h1>
                <div className="searchBar">
                    <CssTextField      
                        label="enter a ticker..."
                        className="searchBar"
                        name="searchBar"
                        type="text"
                        margin="normal"
                        sx={{ input: { color: "#61dafb" }, label: { color: "#61dafb" } }}
                        onChange={this.handleChange}
                        onKeyDown={this.onEnterSearch}
                    />
                    { <StockInfoBox ticker={this.state.ticker}/> }
                </div>
            </div>
        );
    }

    handleChange(e) {
        this.setState({ text: e.target.value });
    }

    onEnterSearch(e) {
      fetch("/api")
        .then((res) => res.json())
        .then((data) => this.setState({ data: data.message }))
        .finally(() => {
          if (e.key === "Enter") {
            if (this.state.searching === true) {
                this.setState({ searching: false, ticker: [this.state.data] });
            } else {
                this.setState({ searching: true, ticker: [this.state.data] });
            }
          }
      });
    }
}

function StockInfoBox(props) {
    return (<h1>{props.ticker[0]}</h1>);
}

export default SearchBar;