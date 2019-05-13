import React from 'react';
import './../scss/App.scss';
import { BrowserRouter as Router, Route, Link} from "react-router-dom";

class Redirect extends React.Component {
  constructor(props){
    super(props)

    //make get request to get actual URL
    //get user info and update visits
    let visit;
    fetch("https://ipapi.co/json").then(res => {
      res.json().then(data => {
        //figure out browser
        const getBrowser = () => {
          var ua = navigator.userAgent, tem,
          M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
          if(/trident/i.test(M[1])){
              tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
              return 'IE '+(tem[1] || '');
          }
          if(M[1] === 'Chrome'){
              tem= ua.match(/\b(OPR|Edge?)\/(\d+)/);
              if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera').replace('Edg ', 'Edge ');
          }
          M = M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
          if((tem = ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);

          return M.join(' ');
        }
        const newVisit = {
          browser: getBrowser(),
          timestamp: (new Date()).toLocaleString(),
          ip: data.ip,
          city: data.city,
          region: data.region,
          region_code: data.region_code,
          country: data.country,
          country_name: data.country_name,
          lat: data.latitude,
          long: data.longitude,
          utc_offset: data.utc_offset,
          asn: data.asn,
          org: data.org
        }
        //get code
        let splitted_path = window.location.pathname.split("/")

        //make sure we get a proper parameter id
        if(splitted_path.length == 2){
          window.location.pathname = "/"
        } else {
          const pathname = window.location.pathname
          let i = pathname.indexOf("rd/") + 3
          let code = pathname.substr(i, pathname.length)

          fetch("http://localhost:12345/rd/" + code, {
            method: "POST",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify(newVisit)
          }).then(res => {
            res.json().then(data => {
              let redirectUrl = data.actualurl
              if(!redirectUrl.includes("http://")){
                redirectUrl = "http://" + redirectUrl
              }
              window.location = redirectUrl
            })
          })

        }

      })
    })
  }

  render(){
    return (
      <p>Please wait...</p>
    )
  }
}

export default Redirect
