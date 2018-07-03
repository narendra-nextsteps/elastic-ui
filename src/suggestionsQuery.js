export const generateSuggestionQuery = (searchValue) => {
  console.log(searchValue)
  var suggestionJson = {
    "query" : {
      "dis_max": {
        "queries": [
          {
            "function_score": {
              "query": {
                "prefix": {
                  "tags.ngram": searchValue
                }
              },
              "boost": 0.5,
              "field_value_factor": {
                "field": "weight",
                "modifier": "sqrt"
              },
              "boost_mode": "sum"
            }
          },
          {
            "function_score": {
              "query": {
                "prefix": {
                  "tags.edgengram": searchValue
                }
              },
              "boost": 1,
              "field_value_factor": {
                "field": "weight",
                "modifier": "sqrt"
              },
              "boost_mode": "sum"
            }
          },
          {
            "function_score": {
              "query": {
                "prefix": {
                  "tags.shingles": searchValue
                }
              },
              "boost": 3,
              "field_value_factor": {
                "field": "weight",
                "modifier": "sqrt"
              },
              "boost_mode": "sum"
            }
          },
          {
            "function_score": {
              "query": {
                "match": {
                  "tags.start_word": searchValue
                }
              },
              "boost": 2,
              "field_value_factor": {
                "field": "weight",
                "modifier": "sqrt"
              },
              "boost_mode": "sum"
            }
          },
          {
            "function_score": {
              "query": {
                "match": {
                  "tags.start_phrase": searchValue
                }
              },
              "boost": 4,
              "field_value_factor": {
                "field": "weight",
                "modifier": "sqrt"
              },
              "boost_mode": "sum"
            }
          },
          {
            "function_score": {
              "query": {
                "match": {
                  "tags.keywordstring": searchValue
                }
              },
              "boost": 5,
              "field_value_factor": {
                "field": "weight",
                "modifier": "sqrt"
              },
              "boost_mode": "sum"
            }
          }
        ]
      }
    }
  }

  return suggestionJson

}

