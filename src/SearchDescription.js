import React from 'react'
import ReactHtmlParser from 'react-html-parser'

const SearchDescription = props => {
  console.log(props.searchResult, props.index)
  const goback = () => {
    props.closeDetails()
  }
  return (
    <div>
      <button onClick={goback}>Go Back To Results</button>
      <div style={{margin: '20px auto', width:'80vw' }}>
        <span style={{fontSize: '1.2em', color: 'blue'}}>Paramater Value: </span>
        {
          ReactHtmlParser(props.searchResult.hits.hits[props.index]._source.ParameterValue)
        }
      </div>
    </div>
  )
}

export default SearchDescription
