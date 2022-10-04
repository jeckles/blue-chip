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
                    {(this.state.searching === true && this.state.stockData !== undefined && this.state.stockEarnings !== undefined) && 
                      <StockDataBox stockData={this.state.stockData} stockEarnings={this.state.stockEarnings} />}
                </div>
            </div>
        );
    }

    handleChange(e) {
        this.setState({ text: e.target.value });
    }

    async onEnterSearch(e) {
      if (e.key === "Enter") {
        if (e.target.value !== '') { 
          await getStock(e.target.value)
                .then((res) => {
                  this.setState({ stockData: res })
                });
          await getStockEarnings(e.target.value)
                .then((res) => {
                  this.setState({ stockEarnings: res });
                });
          this.setState({ searching: true });
        } else {
          this.setState({ searching: false });
        }
      }
    }
}

function StockDataBox(props) {
  var stock = undefined;
  var yearlyEPS = 0;
  var averageSharePrice = 0;
  var ppeRatio = 0;
  var earningsRatio = 0;
  var count = 0;
  for (let obj in props.stockData.data) {
    if (obj === "Time Series (Daily)") {
      stock = Object.values(Object.values(props.stockData.data[obj]).reverse()).pop();
    }
  }
  for (let obj in props.stockEarnings.data) {
    if (obj === "annualEarnings") {
      yearlyEPS = Object.values(props.stockEarnings.data[obj]).sort(function (a,b) {return new Date(a.fiscalDateEnding) - new Date(b.fiscalDateEnding);}).pop().reportedEPS;
    }
  }
  if (stock !== undefined) {
    for (const [key, value] of Object.entries(stock)) {
      if (key !== "5. volume") {
        averageSharePrice = averageSharePrice + Number(value);
        count = count + 1;
      }
    }
  }

  averageSharePrice = Math.round((averageSharePrice / count) * 100) / 100;
  ppeRatio = Math.round((averageSharePrice / yearlyEPS) * 100) / 100;
  earningsRatio = Math.round((yearlyEPS / averageSharePrice) * 100) / 100;

  if (!isNaN(averageSharePrice) && !isNaN(yearlyEPS)) {
    return (
          <div className="grid grid-cols-4 gap-10 gap-y-0">
            <div className="antialiased text-blue">share price</div>
            <div className="antialiased text-blue">earnings per share</div>
            <div className="antialiased text-blue">ppe ratio</div>
            <div className="antialiased text-blue">earnings yield</div>
            <div className="antialiased text-blue">{averageSharePrice}</div>
            <div className="antialiased text-blue">{yearlyEPS}</div>
            <div className="antialiased text-blue">{ppeRatio}</div>
            <div className="antialiased text-blue">{earningsRatio}</div>
          </div>
        );
  }
}

export default SearchBar;