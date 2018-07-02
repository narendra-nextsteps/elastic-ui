import React from 'react'
import Autosuggest from 'react-autosuggest';
import './AutoSuggest.css'
import ListIndex from './ListIndex'
import axios from 'axios'
import {suggestionsUrl, searchUrl} from './url'
import {suggest} from './suggest'

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
  // const maxScore = data.hits.max_score
  data.hits.hits.map ((value, index) => {
    listOfSuggestions.push(`${value._source.tags} (score -- ${value._score.toFixed(2)})`)
    if (index === 0 || index === 1 || index === 2) { firstResponseValue.push(value._source.tags)} // for do you mean
  })
  return [listOfSuggestions, firstResponseValue]
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
      firstResponseValue: []
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
    if (suggestion !== null) {
      axios.post(suggestionsUrl, suggestionJson)
      .then((response)=>{
        if (response.data.hits.length === 0 ) return
        var data = renderDataNew(response.data)
        // var data = renderDataNew(suggest)
        if (data !== undefined) {
          this.setState({
            suggestions: data[0],
            firstResponseValue: data[1]
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
  onSuggestionHighlighted = (suggestion) => {
    console.log(suggestion)
  }

  render() {
    const { value, suggestions, searchValue, firstResponseValue } = this.state;
    // console.log(value, suggestions)
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
          firstResponseValue={firstResponseValue}
          />
        : null
      }
      </div>
    );
  }
}

export default AutoSuggest
