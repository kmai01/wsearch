import React from 'react';

import './App.css';

var animalsArray=[

  "dog",
  "cat",
  "rabbit",
];

var randomItems=animalsArray[Math.floor(Math.random()*animalsArray.length)];
console.log(randomItems);

class wikiSearch extends React.Component{
 constructor(props) {
   super(props);
   this.state ={
     searchReturnValues: [],
     searchTerm : randomItems
   }
   console.log('contructor run')
 }



 useSearchEngine =(event) =>{
  event.preventDefault();
  console.log('state run')
   
   this.setState({
     searchReturnValues: [],
     
   })

   const pointerToThis = this
   
   var url = "https://en.wikipedia.org/w/api.php"; 

   var params = {
       action: "query",
       list: "search",
       srsearch: this.state.searchTerm,
       format: "json"
   };
   
   url = url + "?origin=*";
   Object.keys(params).forEach((key) => {
     
    url += "&" + key + "=" + params[key];
  });

  fetch(url)
  .then(
    function (response) {
      return response.json();
    }
  )
  .then(
    function(response) {
      // console.log(response.query.search[0].pageid)
      
      for (var key in response.query.search) {

        pointerToThis.state.searchReturnValues.push({
          queryResultPageFullURL: 'no link',
          queryResultPageID: response.query.search[key].pageid,
          queryResultPageTitle: response.query.search[key].title,
          queryResultPageSnippet: response.query.search[key].snippet,
         });
      }
    } 
  )
  .then(
    function (response) {
      for ( var key2 in pointerToThis.state.searchReturnValues) {
        // console.log(pointerToThis.state.searchReturnValues)
        let page = pointerToThis.state.searchReturnValues[key2]; 
        let pageID = page.queryResultPageID;
        let urlForRetrievingPageID = `https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=info&pageids=${pageID}&inprop=url&format=json`;

        fetch(urlForRetrievingPageID)
        .then(
          function(response) {
            return response.json();

          }
        )
        .then(
          function (response) {
            page.queryResultPageFullURL = response.query.pages[pageID].fullurl;
            
            pointerToThis.forceUpdate();
          }
          )
        
      }
    }
  )

 }

  changeSearchTerms = (event) =>{
    this.setState({
      searchTerm: event.target.value
    });
  }

render() {
  console.log('render run')

  let searchResults= [];
   for (var key3 in this.state.searchReturnValues){
     searchResults.push(
       <div className="searchResultDiv" key={key3}>
         <h3><a href={this.state.searchReturnValues[key3].queryResultPageFullURL}>{this.state.searchReturnValues[key3].queryResultPageTitle}</a></h3>
         <span className='link'><a href={this.state.searchReturnValues[key3].queryResultPageFullURL}>{this.state.searchReturnValues[key3].queryResultPageFullURL}</a></span>
         <p className="description" dangerouslySetInnerHTML={{__html: this.state.searchReturnValues[key3].queryResultPageSnippet}}></p>
       </div>

     )


   }

  return (
    

    <div className="App">
      <h1> Search Fact</h1>
      <form action ="">
        <input type="text" value={this.state.searchTerm || ''} onChange={this.changeSearchTerms} placeholder = "Search for Fact" />
        <button type="submit" onClick={this.useSearchEngine}>Search</button>
      </form>
      

      {searchResults}

    </div>
  );
}
}
export default wikiSearch;
