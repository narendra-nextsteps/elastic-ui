import React from 'react'
import ReactHtmlParser from 'react-html-parser';

const contentStyle = {
    backgroundColor:'#e5e5e5',
    fontSize:'1rem',
    padding: '1% 2%',
    margin: '5px',
    borderRadius: '5px'
}
const ListResults = (props) => {
    var html=null
    return (
        <div style={{padding:'2px 10px', margin:'1% 10%'}}>
            {
                props.searchResult.map((value, index) => (
                    <div key={index} style={contentStyle}>
                        {
                            ReactHtmlParser(value._source.ParameterValue)
                        }
                        {/* <div style={{color:'blue'}}>{value._source.ParameterValueForSearch}</div> */}
                    </div>
                ))
            }
        </div>
    )
}

export default ListResults
