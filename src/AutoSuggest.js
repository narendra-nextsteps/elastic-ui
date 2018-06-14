import React from 'react'
import Autosuggest from 'react-autosuggest';
import './AutoSuggest.css'
import ListResults from './ListResults'
import axios from 'axios'

// Imagine you have a list of languages that you'd like to autosuggest.
const languages = [
  {
    name: 'C',
    year: 1972
  },
  {
    name: 'Elm',
    year: 2012
  },
]

// Teach Autosuggest how to calculate suggestions for any given input value.
// const getSuggestions = value => {
//   const inputValue = value.trim().toLowerCase();
//   const inputLength = inputValue.length;

//   return inputLength === 0 ? [] : languages.filter(lang =>
//     lang.name.toLowerCase().slice(0, inputLength) === inputValue
//   );
// };

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
  <div >
    {suggestion}
  </div>
);

var suggestionJson = {
  "suggest": {
    "text" : "plastc crd",
    "param" : {
      "phrase" : {
        "field" : "ParameterValueForSearch.trigram",
        "size" : 5,
        "direct_generator" : [ {
          "field" : "ParameterValueForSearch.trigram",
          "suggest_mode" : "always"
        }]
      }
    },
    "name" : {
      "phrase" : {
        "field" : "NodeName.trigram",
        "size" : 5,
        "direct_generator" : [ {
          "field" : "NodeName.trigram",
          "suggest_mode" : "always"
        }]
      }
    },
      "title" : {
      "phrase" : {
        "field" : "NodeTitle.trigram",
        "size" : 5,
        "direct_generator" : [ {
          "field" : "NodeTitle.trigram",
          "suggest_mode" : "always"
        }]
      }
    }
  }
}

const getSuggestionOnSearch = value => {
  const suggestion = {...suggestionJson}
  suggestion.suggest.text = value
  return suggestion
}

const renderData = data => {
  var listOfSuggestions = new Set()
  // console.log(data)
  data.name[0].options.map(value => listOfSuggestions.add(value.text))
  data.param[0].options.map(value => listOfSuggestions.add(value.text))
  data.title[0].options.map(value => listOfSuggestions.add(value.text))
  console.log(listOfSuggestions)
  return [...listOfSuggestions]
}

class AutoSuggest extends React.Component {
  constructor() {
    super();

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: '',
      suggestions: [],
      showResults: false,
      searchResult: []
    };
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    })
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    var suggestion = null
    value.length > 2 ? suggestion = getSuggestionOnSearch(value) : null
    suggestion !== null
    ? axios.post("http://localhost:9200/nodes/node_details/_search", suggestionJson)
    .then((response)=>{
      // console.log(response.data.suggest)
      var data = renderData(response.data.suggest)
      data !== undefined ?
      this.setState({
        suggestions: data
      }, ()=>{console.log(this.state.suggestions)}): null
    })
    : null

  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSubmit = (event, str) => {
    // api call to get final suggestions
    var searchQuery = {
      "query": {
          "multi_match": {
            "query": "plastic card",
            "fields": ["ParameterValueForSearch.trigram", "NodeName.keywordstring", "NodeTitle.keywordstring"]
          }
        },
          "highlight" : {
              "fields" : {
                  "ParameterValueForSearch" : {},
                  "NodeName": {},
                  "NodeTitle": {}
              }
          }
      }
    searchQuery.query.multi_match.query = this.state.value
    // console.log(searchQuery)
    axios.post('http://localhost:9200/nodes/node_details/_search', searchQuery )
    .then((response)=>{
      console.log(response.data.hits.hits)
      const searchResult = response.data.hits.hits
      this.setState({searchResult, showResults: true})
    })
    event.preventDefault()
    // console.log(event, str, 'api call to be made', this.state.value)

  }

  render() {
    const { value, suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Search ...',
      value,
      onChange: this.onChange
    };

    // Finally, render it!
    return (
      <div >
      <form onSubmit={(event) => this.onSubmit(event, 'submit')} >
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
        />
        <button type='submit'>Search</button>
      </form>
      {
        this.state.showResults
        ? <ListResults searchResult={this.state.searchResult} />
        : null
      }
      </div>
    );
  }
}

export default AutoSuggest
