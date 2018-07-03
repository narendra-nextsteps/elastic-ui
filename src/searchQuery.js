export const generateSearchQuery = searchValue => {
  var searchJson = {
    "query" : {
      "dis_max": {
        "queries": [
          {
            "function_score": {
              "query": {
                "prefix": {
                  "ParameterDisplayName.ngram": searchValue
                }
              },
              "boost": 3
            }
          },
          {
            "function_score": {
              "query": {
                "prefix": {
                  "ParameterDisplayName.edgengram": searchValue
                }
              },
              "boost": 5
            }
          },
          {
            "function_score": {
              "query": {
                "prefix": {
                  "ParameterDisplayName.start_word": searchValue
                }
              },
              "boost": 6
            }
          },
          {
            "function_score": {
              "query": {
                "match": {
                  "ParameterDisplayName.start_phrase": searchValue
                }
              },
              "boost": 8
            }
          },
          {
            "function_score": {
              "query": {
                "match": {
                  "ParameterValueForSearch.shingles": searchValue
                }
              },
              "boost": 4
            }
          },
          {
            "function_score": {
              "query": {
                "match": {
                  "ParameterValueForSearch.edgengram": searchValue
                }
              },
              "boost": 1
            }
          },
          {
            "function_score": {
              "query": {
                "match": {
                  "ParameterValueForSearch.ngram": searchValue
                }
              },
              "boost": 0.5
            }
          }
        ]
      }
    }
  }

  return searchJson
}