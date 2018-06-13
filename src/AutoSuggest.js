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
      showResults: false
    };
  }

  onChange = (event, { newValue }) => {
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
    newValue.length > 2 ? suggestionJson.suggest.text=newValue : null
    axios.post("http://localhost:9200/nodes/node_details/_search", suggestionJson)
    .then((response)=>{
      console.log(response.data.suggest)
    })
    this.setState({
      value: newValue
    });
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {

    this.setState({
      suggestions: ['apple', 'ball']
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSubmit = (event, str) => {
    // api call to get final suggestions
    event.preventDefault()
    console.log(event, str, 'api call to be made')
    this.setState({showResults: true})
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
        ? <ListResults />
        : null
      }
      </div>
    );
  }
}

export default AutoSuggest
