import React, {Fragment, Component} from 'react'
// import ReactHtmlParser from 'react-html-parser';
import axios from 'axios';
import {serverUrl, localUrl} from './url'
import RenderNode from './RenderNode'


const contentStyle = {
    backgroundColor:'#e5e5e5',
    fontSize:'1rem',
    padding: '1% 2%',
    marginTop: '15px',
    borderRadius: '5px'
}

class ListIndex extends Component {
  constructor(props){
    super(props)
    this.state = {
      nodeDescription: null,
      showDescription: false
    }
  }

  getDescription = (nodeId) => {
    //api call to get node details
    // console.log(nodeId)
    var descriptionQuery = {
      "query" : {
          "constant_score" : {
              "filter" : {
                  "term" : {
                      "NodeId" : "3884"
                  }
              }
          }
      }
    }
    descriptionQuery.query.constant_score.filter.term.NodeId = nodeId
    axios.post(serverUrl, descriptionQuery)
    .then((response) => {
      console.log(response.data.hits.hits)
      const nodeDescription = response.data.hits.hits
      this.setState({nodeDescription ,showDescription: true})
    })
  }

  closeDetails = (value) => {
    console.log(value)
    this.setState({showDescription: false})
  }

  render() {
    return (
      <Fragment>
      {
        !this.state.showDescription
        ? <div style={{padding:'2px 10px', margin:'1% 10%'}}>
          {
            this.props.searchResult.map((value, index) => (
              <div key={index} style={contentStyle}>
                {
                    // ReactHtmlParser(value._source.ParameterValue)
                  <div onClick={() => this.getDescription(value._source.NodeId)}>
                    {
                      value._source.NodeName
                      ? <span style={{}}>
                          <strong style={{color: 'blue'}}> Node Name: </strong>
                          {value._source.NodeName}
                        </span>
                      : null
                    }
                    <span style={{display: 'block'}}>
                      <strong style={{color: 'blue'}}>Node Id: </strong>
                      {value._source.NodeId}
                    </span>
                  </div>
                }
              </div>
            ))
          }
        </div>
      : <RenderNode nodeDescription={this.state.nodeDescription}
          closeDetails={this.closeDetails}
        />
      }
      </Fragment>
    )
  }
}

export default ListIndex
