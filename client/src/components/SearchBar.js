import React from 'react';
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

  const getStock = async ticker => {
    console.log(`getting stock data for ${ticker}`);
    const request = await fetch("/stock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ticker: ticker,
          type: "daily"
        })
      });
    
    const data = await request.json();
    return data;
  };

const getStockEarnings = async ticker => {
  console.log(`getting stock earnings for ${ticker}`);
  const request = await fetch("/stock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ticker: ticker,
        type: "earnings"
      })  
    });

    const data = await request.json();
    return data;
};

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { text: '', searching: false, ticker: [], stockData: {}, stockEarnings: {} };
        this.handleChange = this.handleChange.bind(this);
        this.onEnterSearch = this.onEnterSearch.bind(this);
    }

    render() {
        return (
            <div className="main">
                <h1 className="title font-bold">BlueChip</h1>
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
                    <StockDataBox stockData={this.state.stockData} stockEarnings={this.state.stockEarnings} />
                </div>
            </div>
        );
    }

    handleChange(e) {
        this.setState({ text: e.target.value });
    }

    async onEnterSearch(e) {
      if (e.key === "Enter") {
       
        await getStock(e.target.value)
        .then((res) => {
          this.setState({ stockData: res })
        });

        await getStockEarnings(e.target.value)
        .then((res) => {
          this.setState({ stockEarnings: res });
        });

        if (this.state.searching === true) {
          this.setState({ searching: false });
        } else {
          this.setState({ searching: true });
        }
      }
    }
}

function StockDataBox(props) {
  console.log(props);
  return (<h1>{"STONKS"}</h1>);
}

export default SearchBar;