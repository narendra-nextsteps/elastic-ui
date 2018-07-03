import React from 'react'
import Autosuggest from 'react-autosuggest';
import './AutoSuggest.css'
import ListIndex from './ListIndex'
import axios from 'axios'
import {suggestionsUrl, searchUrl} from './url'
import {suggest} from './suggest'
import {generateSuggestionQuery} from './suggestionsQuery'
import {generateSearchQuery} from './searchQuery'

// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
  <div >
    {suggestion}
  </div>
);

// var suggestionJson = {
//   "query":{
//     "match": {
//       "tags.edgengram": "pla"
//     }
//   }
// }

// var searchQuery = {
//   "query": {
//     "multi_match": {
//       "query":"movies",
//       "fields":["ParameterValueForSearch.ngram","NodeTitle.ngram","NodeName.ngram"]
//     }
//   },
//     "highlight" : {
//         "fields" : {
//             "ParameterValueForSearch.ngram" : {},
//       "NodeTitle.ngram" : {},
//       "NodeName.ngram": {}
//         }
//     }
// }

const getSuggestionOnSearch = value => {
  const suggestion = generateSuggestionQuery(value)
  // suggestion.query.match["tags.edgengram"] = value
  // suggestionJson = suggestion
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
      responseSuggestions = []
  // const maxScore = data.hits.max_score
  data.hits.hits.map ((value, index) => {
    listOfSuggestions.push(`${value._source.tags} (score -- ${value._score.toFixed(2)})`)
    responseSuggestions.push(value._source.tags) // for do you mean
  })
  return [listOfSuggestions, responseSuggestions]
}

class AutoSuggest extends React.Component {
  constructor() {
    super();
    this.state = {
      value: '',
      suggestions: [],
      showResults: false,
      searchResult: [],
      searchValue: '',
      responseSuggestions: []
    };
  }

  onChange = (event, { newValue }) => {
    const scoreRegEx= /\s\(score.*\)$/
    const valueWithoutScore = newValue.replace(scoreRegEx, '')
    this.setState({
      value: valueWithoutScore
    })
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({searchValue: value})
    var suggestion = null //getSuggestionOnSearch(value)
    value.length >= 1 ? suggestion = getSuggestionOnSearch(value) : null
    console.log("suggestion", suggestion)
    if (suggestion !== null) {
      axios.post(suggestionsUrl, suggestion)
      .then((response)=>{
        if (response.data.hits.length === 0 ) return
        var data = renderDataNew(response.data)
        // var data = renderDataNew(suggest)
        if (data !== undefined) {
          this.setState({
            suggestions: data[0],
            responseSuggestions: data[1]
          })
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

  onSubmit = (event) => {
    // api call to get final suggestions
    const searchQuery = generateSearchQuery(this.state.value)
    console.log("searchQuery", searchQuery)
    axios.post(searchUrl, searchQuery )
    .then((response)=>{
      console.log(response.data)
      const searchResult = response.data
      this.setState({searchResult, showResults: true})
    })
    event ? event.preventDefault() : null
  }

  searchSuggestedValue = (value) => {
    console.log(value)
    this.setState({value})
    this.onSubmit()
  }

  render() {
    const { value, suggestions, responseSuggestions } = this.state;
    // console.log(value, responseSuggestions, responseSuggestions.includes(value))
    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Search ...',
      value,
      onChange: this.onChange
    };

    // Finally, render it!
    return (
      <div >
      <form onSubmit={(event) => this.onSubmit(event)} >
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          onSuggestionHighlighted={this.onSuggestionHighlighted}
          onSuggestionSelected={this.onSubmit}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
        />
        <button type='submit'>Search</button>
      </form>
      {
        this.state.showResults
        ? <ListIndex searchResult={this.state.searchResult}
          searchValue={value}
          responseSuggestions={responseSuggestions}
          searchSuggestedValue = {this.searchSuggestedValue}
          />
        : null
      }
      </div>
    );
  }
}

export default AutoSuggest
