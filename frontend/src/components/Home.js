import React from 'react';
import './../scss/App.scss';
import { BrowserRouter as Router, Route, Link} from "react-router-dom";

class Home extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      query: "",
      btn: "",
      newCode: ""
    }

    this.smolize = this.smolize.bind(this)
    this.saveQuery = this.saveQuery.bind(this)
    this.generateCode = this.generateCode.bind(this)
    this.exists = this.exists.bind(this)
    this.isURL = this.isURL.bind(this)

  }

  isURL = (url) => {
    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);

    return url.match(regex)
  }

  exists = (code) => {
    //if db returns nothing upon search return true
    //false otherwise
    fetch("http://localhost:12345/urls/" + code).then(data => {
      data.json().then(res => {
        return res != {"count":0,"actualurl":"","visits":null}
      })
    })
  }

  generateCode = () => {
    //generate random number
    let i = parseInt(this.state.query.length * Math.random())

    //randomly choose 5 letters from url
    let code = ""

    for(let j = 0; j < 5; j++){
      let random_index = Math.floor(Math.random() * this.state.query.length)
      code += this.state.query.charAt(random_index)
    }

    //make i rotations on ascii chart but make sure it is in range
    //33 - 125
    //https://www.ascii-code.com/
    let finalCode = ""

    for(let j = 0; j < 5; j++){
      let ascii = code.charCodeAt(j)
      let post_rotation = ascii + i
      while(post_rotation > 125){
        let diff = post_rotation - 125
        post_rotation = 33 + diff
      }
      finalCode += String.fromCharCode(post_rotation)
    }

    //lastly check whether its already been created in db
    if(this.exists(finalCode)){
      return this.generateCode()
    } else {
      return finalCode
    }

  }

  smolize = () => {
    if(this.state.query.length > 0 && this.isURL(this.state.query)){
      //create a url endpoint
      let code = this.generateCode()
      console.log(code)
      let newUrl = {
        count: 0,
        actualurl: this.state.query,
        visits: []
      }

      fetch("http://localhost:12345/urls/" + code, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newUrl)
      }).then(res => {
        console.log(res)
      })

      setTimeout(() => {
        this.setState({
          newCode: code
        })
      }, 200)

    }
  }

  saveQuery = (e) => {
    if(e.target.value.length > 0 && this.isURL(e.target.value)){
      this.setState({
        query: e.target.value,
        btn: "active"
      })
    } else {
      this.setState({
        query: e.target.value,
        btn: ""
      })
    }
  }

  render = () => {
    return (
      <div className="Home">
        <div className="logo">
          <span className="f">Smol</span>
          <span className="s">lnk</span>
        </div>
        <div className="search-box">
          <input type="text" className="query" onChange={this.saveQuery} />
          <button className={"submit " + this.state.btn} onClick={this.smolize}>Submit</button>
        </div>
        {this.state.newCode.length > 0 &&
          <div className="results">
            <h3 className="url-desc">
              Your Smolified url:
              <a target="_blank" href={"http://localhost:3000/rd/" + this.state.newCode}>
                {" " + "http://localhost:3000/rd/" + this.state.newCode}
              </a>
            </h3>
            <h3>
              You can also find stats about your link here:
              <a target="_blank" href={"http://localhost:12345/urls/" + this.state.newCode}>
                {" " + "http://localhost:12345/urls/" + this.state.newCode}
              </a>
            </h3>
          </div>
        }
      </div>
    )
  }

}

export default Home;
