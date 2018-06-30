import React from 'react'
import Autosuggest from 'react-autosuggest';
import './AutoSuggest.css'
import ListIndex from './ListIndex'
import axios from 'axios'
import {suggestionsUrl, searchUrl} from './url'
import {suggest} from './suggest'

// Imagine you have a list of languages that you'd like to autosuggest.
// const languages = [
//   {
//     name: 'C',
//     year: 1972
//   },
//   {
//     name: 'Elm',
//     year: 2012
//   },
// ]

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
  "query":{
    "match": {
      "tags.edgengram": "pla"
    }
  }
}

const getSuggestionOnSearch = value => {
  const suggestion = {...suggestionJson}
  suggestion.query.match["tags.edgengram"] = value
  console.log(suggestion)
  return suggestion
}

const renderData = data => {
  var listOfSuggestions = new Set()
  // console.log(data)
  data.name[0].options.map(value => listOfSuggestions.add(value.text))
  data.param[0].options.map(value => listOfSuggestions.add(value.text))
  data.title[0].options.map(value => listOfSuggestions.add(value.text))
  // console.log(listOfSuggestions)
  return [...listOfSuggestions]
}

const renderDataNew = data => {
  var listOfSuggestions = [],
      firstResponseValue = []
  const maxScore = data.hits.max_score
  data.hits.hits.map ((value, index) => {
    listOfSuggestions.push(`${value._source.tags} (score -- ${Math.round((value._score/maxScore)*100)})`)
    if (index === 0 || index === 1 || index === 2) { firstResponseValue.push(value._source.tags)} // for do you mean
  })
  return [listOfSuggestions, firstResponseValue]
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
      searchResult: [],
      searchValue: '',
      firstResponseValue: []
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
    this.setState({searchValue: value})
    var suggestion = null //getSuggestionOnSearch(value)
    value.length >= 1 ? suggestion = getSuggestionOnSearch(value) : null
    if (suggestion !== null) {
      axios.post(suggestionsUrl, suggestionJson)
      .then((response)=>{
        console.log(response.data)
        if (response.data.hits.length === 0 ) return
        var data = renderDataNew(response.data)
        // var data = renderDataNew(suggest)
        if (data !== undefined) {
          this.setState({
            suggestions: data[0],
            firstResponseValue: data[1]
          }, ()=>{console.log(this.state.suggestions)})
        }
      })
    }

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
          "query":"movies",
          "fields":["ParameterValueForSearch.ngram","NodeTitle.ngram","NodeName.ngram"]
        }
      },
        "highlight" : {
            "fields" : {
                "ParameterValueForSearch.ngram" : {},
          "NodeTitle.ngram" : {},
          "NodeName.ngram": {}
            }
        }
    }
    searchQuery.query.multi_match.query = this.state.value
    // console.log(searchQuery)
    axios.post(searchUrl, searchQuery )
    .then((response)=>{
      console.log(response.data.hits)
      const searchResult = response.data
      this.setState({searchResult, showResults: true})
    })
    event.preventDefault()
    // console.log(event, str, 'api call to be made', this.state.value)

  }

  render() {
    const { value, suggestions, searchValue, firstResponseValue } = this.state;
    console.log(value, suggestions)
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
        ? <ListIndex searchResult={this.state.searchResult}
          searchValue={searchValue}
          firstResponseValue={firstResponseValue}
          />
        : null
      }
      </div>
    );
  }
}

export default AutoSuggest
