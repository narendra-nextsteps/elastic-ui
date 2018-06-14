import React from 'react'
import ReactHtmlParser from 'react-html-parser';

const RenderChild = (value) => {
  console.log("render child",value)
  if (value._source){
      if (value._source.ParameterDisplayName === "Documents Repository") {
      return ReactHtmlParser(value._source.ParameterValue)
    } else if (value._source.ParameterDisplayName === "General Description") {
      return ReactHtmlParser(value._source.ParameterValue)
    } else if (value._source.ParameterDisplayName === "Document Description") {
      return ReactHtmlParser(value._source.ParameterValue)
    }
  }
  return <div>No Description</div>

}
const RenderNode = (props) => {
  const goback = () => {
    props.closeDetails()
  }
  return (
    <div>
    <button onClick={goback}>Go Back To Results</button>
      {
        props.nodeDescription.map((value, index) => (
          // console.log(value._source.ParameterDisplayName)
          <RenderChild value={value} key={index} />
          // <div>{value._source}</div>
        ))
      }
    </div>
  )
}

export default RenderNode
