import React from "react";
import { Link } from "react-router-dom";
import signIn from "./signIn";
import signUp from "./signUp";
import { BrowserRouter, Switch, Redirect } from "react-router-dom";
import { Route } from "react-router-dom";
import home from "./home";
import { withCookies, Cookies } from "react-cookie";
import { instanceOf } from "prop-types";

class App extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };

  constructor(prop) {
    super(prop);
    const { cookies } = prop;
    this.state = {
      key: cookies.get("key") || "unknow",
    };
    // console.log("APP :",this.state.key)
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={signIn} />
          {/* <Route path="/home"  render={() => {
              return (
                
                this.state.key === "unknow"?
                 <Route path="/signIn" component={signIn} />:
                
                // <Redirect from='/home' to="/signIn" /> :
                // <Redirect from='/home' to="/signIn" /> :
                <Route path="/home" component={home} />
                
                // <Redirect to="/home" /> :
                // <Redirect to="/signIn" /> 
              )
          }} />  */}
          <Route path="/home" component={home} />
          <Route path="/signIn" component={signIn} />
          <Route path="/signUp" component={signUp} />
          <Route component={signIn} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default withCookies(App);
