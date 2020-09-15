import React from "react";
import { Link } from "react-router-dom";
import logo from "./assets/logo.png";
import { withCookies, Cookies } from "react-cookie";
import { instanceOf } from "prop-types";
import "./home.css";
import "./signIn.css";

class home extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };

  constructor(prop) {
    super(prop);
    const { cookies } = prop;
    //console.log(cookies.get("isEng"),this.state.isEng)
    this.state = {
      isEng: cookies.get("isEng") === "true" ? true : false || false,
      key: cookies.get("key") || "unknow",
      ever: false,
      getdata: false,
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      text_ena: false,
    };
    this.timer = null;
  }

  componentDidMount(prevProps, prevState) {
    this.timeout();
    // console.log("did mount");
  }

  timeout() {
    // console.log("clear")
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.handlerLogout(), 60000); //3000000) 5 นาที
  }

  handleSubmit() {
    // console.log(this.state.ever,this.state.getdata)
    // console.log("getdata")
    // console.log("Home: ",this.state.key)
    this.timeout();
    if (!this.state.ever) {
      var inp = {
        key: this.state.key,
      };
      fetch("http://localhost:5000/getdata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inp),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data["status"] === "Fail") {
            alert(data["detail"]);
          }
          if (data["status"] === "OK") {
            this.setState({
              firstName: data["firstname"],
              lastName: data["lastname"],
              email: data["email"],
              phoneNumber: data["phonenumber"],
            });
            this.setState({ getdata: true, ever: true });
          }
        });
    }
    this.setState({ text_ena: !this.state.text_ena });
    // console.log(this.state.text_ena);
  }

  handlerLogout() {
    // console.log("logout")
    const { cookies } = this.props;
    var inp = {
      key: this.state.key,
    };
    fetch("http://localhost:5000/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inp),
    })
      .then((response) => response.json())
      .then((data) => {
        /*if(data['status'] === 'Fail') {
            alert(data['detail'])
        }*/
        if (data["status"] === "OK" || data["status"] === "Fail") {
          cookies.remove("key", { path: "/" });
          this.setState({
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            key: "unknow",
          });
          this.setState({ getdata: false, ever: false });
          this.props.history.push("/signIn");
        }
      });
  }

  render() {
    return (
      <div className="home">
        <div className="content">
          <h1> {this.state.isEng ? "Welcome" : "ยินดีต้อนรับ"}</h1>

          <input
            type="submit"
            value={this.state.isEng ? "Personal Data" : "ข้อมูลส่วนตัว"}
            className="submit-active"
            onClick={this.handleSubmit.bind(this)}
          />

          <div className="grop">
            <div className={this.state.text_ena ? "data" : "nonedis"}>
              <p style={{ paddingRight: "20px" }}>
                {this.state.isEng ? "Firstname" : "ชื่อ"} :
              </p>
              <p>{this.state.firstName}</p>
            </div>
            <div className={this.state.text_ena ? "data" : "nonedis"}>
              <p style={{ paddingRight: "20px" }}>
                {this.state.isEng ? "Lastname" : "นามสกุล"} :
              </p>
              <p>{this.state.lastName}</p>
            </div>
            <div className={this.state.text_ena ? "data" : "nonedis"}>
              <p style={{ paddingRight: "20px" }}>
                {this.state.isEng ? "Email" : "อีเมลล์"} :
              </p>
              <p>{this.state.email}</p>
            </div>
            <div className={this.state.text_ena ? "data" : "nonedis"}>
              <p style={{ paddingRight: "20px" }}>
                {this.state.isEng ? " Phone number" : "เบอร์โทรศัพท์"} :
              </p>
              <p>{this.state.phoneNumber}</p>
            </div>
          </div>

          <input
            type="submit"
            value={this.state.isEng ? "logout" : "ออกจากระบบ"}
            className="submit-active"
            onClick={this.handlerLogout.bind(this)}
            style={{ justifyItems: "flex-end", justifySelf: "flex-end" }}
          />
        </div>
      </div>
    );
  }
}
export default withCookies(home);
