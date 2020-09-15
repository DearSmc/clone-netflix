import React from "react";
import { Link } from "react-router-dom";
import "./signUp.css";
import logo from "./assets/logo.png";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import validator from "validator";
import { Redirect } from "react-router";
import signIn from "./signIn";

class signUp extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };

  constructor(props) {
    super(props);
    const { cookies } = props;
    this.state = {
      // isEng: false,
      isEng: cookies.get("isEng") === "true" ? true : false || false,
      fName: "",
      lName: "",
      pass: "",
      conPass: "",
      email: "",
      phoneNum: "",

      mesFirstName: "",
      mesLastName: "",
      mesPass: "",
      mesConPass: "",
      mesEmail: "",
      mesPhoneNum: "",

      inputChange: false,
      button_ena: true,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { cookies } = this.props;
    //console.log("Do")
    if (prevState.fName !== this.state.fName) {
      this.cheakFirstName();
      this.setState({ inputChange: true });
    }
    if (prevState.lName !== this.state.lName) {
      this.cheakLastName();
      this.setState({ inputChange: true });
    }
    if (prevState.email !== this.state.email) {
      this.cheakEmail();
      this.setState({ inputChange: true });
    }
    if (prevState.pass !== this.state.pass) {
      this.cheakPass();
      this.setState({ inputChange: true });
    }
    if (prevState.conPass !== this.state.conPass) {
      this.cheakConPass();
      this.setState({ inputChange: true });
    }
    if (prevState.phoneNum !== this.state.phoneNum) {
      this.cheakPhoneNumber();
      this.setState({ inputChange: true });
    }

    if (this.state.inputChange) {
      if (
        this.state.mesConPass == "" &&
        this.state.mesEmail == "" &&
        this.state.mesFirstName == "" &&
        this.state.mesLastName == "" &&
        this.state.mesPass == "" &&
        this.state.mesPhoneNum == ""
      ) {
        this.setState({ button_ena: false });
      } else {
        this.setState({ button_ena: true });
      }

      this.setState({ inputChange: false });
    }

    if (prevState.isEng !== this.state.isEng) {
      cookies.set("isEng", this.state.isEng, { path: "/" });

      this.cheakFirstName();
      this.cheakLastName();
      if (this.state.email !== "") this.cheakEmail();
      if (this.state.pass !== "") this.cheakPass();
      if (this.state.conPass !== "") this.cheakConPass();
      if (this.state.phoneNum !== "") this.cheakPhoneNumber();
    }
  }

  setLang(event) {
    // console.log(event.target.text)
    const { cookies } = this.props;
    if (event.target.name === "lang_thai") {
      this.setState({ isEng: false });
      cookies.set("isEng", false);
      //     console.log(cookies.get('isEng'))
    } else if (event.target.name === "lang_eng") {
      this.setState({ isEng: true });
      cookies.set("isEng", true);
      // console.log(cookies.get('isEng'))
    }
    if (this.state.fName !== "") this.cheakFirstName();
    if (this.state.lName !== "") this.cheakLastName();
    if (this.state.email !== "") this.cheakEmail();
    if (this.state.pass !== "") this.cheakPass();
    if (this.state.conPass !== "") this.cheakConPass();
    if (this.state.phoneNum !== "") this.cheakPhoneNumber();
  }

  //  -------------------------------- validate --------------------------------------

  cheakFirstName() {
    let message = "";
    if (this.state.fName.length < 1) {
      if (this.state.isEng)
        message = "Firstname must contain more than one character.";
      else message = "ชื่อต้องมีอักขระมากกว่า 1 อักขระ";
    }
    this.setState({ mesFirstName: message });
  }

  cheakLastName() {
    let message = "";
    if (this.state.lName.length < 1) {
      if (this.state.isEng)
        message = "Lastname must contain more than one character.";
      else message = "นามสกุลต้องมีอักขระมากกว่า 1 อักขระ";
    }
    this.setState({ mesLastName: message });
  }

  validatePhoneNumber = (number) => {
    const isValidPhoneNumber = validator.isMobilePhone(number, [
      "th-TH",
      "uk-UA",
    ]);
    return isValidPhoneNumber;
  };

  cheakEmail() {
    let message = "";

    // (A||B) & C -> true
    // A B C ans
    // 1 0 0 0 ----> alert
    // 1 0 1 1
    // 0 1 0 0 ----> alert
    // 0 1 1 1
    // 1 1 1 1
    // 1 1 0 0 ----> alert
    // 0 0 1 0 ----> alert
    // 0 0 0 0 ----> alert
    if (
      !(
        (/^[a-zA-Z0-9_]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(this.state.email) ||
          /^[a-zA-Z0-9_]+@[a-zA-Z0-9]+\.[A-Za-z]+\.[a-zA-Z]+$/.test(
            this.state.email
          )) &&
        this.state.email.length >= 8
      )
    ) {
      if (this.state.isEng) message = "Please enter a valid email.";
      else message = "โปรดป้อนอีเมลที่ถูกต้อง";
    }

    this.setState({ mesEmail: message });
  }

  cheakPass() {
    let message = "";
    if (this.state.pass.length < 4 || this.state.pass.length >= 60) {
      if (this.state.isEng)
        message = "Your password must contain between 4 and 60 characters.";
      else message = "รหัสผ่านต้องมีจำนวนระหว่าง 4 ถึง 60 อักขระ";
    }
    this.setState({ mesPass: message });
  }

  cheakConPass() {
    let message = "";
    if (this.state.conPass.length < 4 || this.state.conPass.length >= 60) {
      if (this.state.isEng)
        message = "Your password must contain between 4 and 60 characters.";
      else message = "รหัสผ่านต้องมีจำนวนระหว่าง 4 ถึง 60 อักขระ";
    } else if (this.state.conPass !== this.state.pass) {
      if (this.state.isEng) message = "Password confirmation is incorrect.";
      else message = "การยืนยันรหัสผ่านไม่ถูกต้อง";
    }
    this.setState({ mesConPass: message });
  }

  cheakPhoneNumber() {
    let message = "";

    if (!isNaN(this.state.phoneNum)) {
      if (!this.validatePhoneNumber(this.state.phoneNum)) {
        if (this.state.isEng) message = "Please enter a valid phone number.";
        else message = "โปรดป้อนหมายเลขโทรศัพท์ที่ถูกต้อง";
      }
    }

    this.setState({ mesPhoneNum: message });
  }
  // ---------------------------------------------------------------------------------------------
  onChangeHandler(e) {
    // console.log(e.target.name);
    var x = e.target.value.split("").filter((el) => {
      return (
        ("A" <= el && el <= "Z") ||
        ("a" <= el && el <= "z") ||
        ("0" <= el && el <= "9") ||
        "!@#$%^&*()_+=-.".includes(el)
      );
    });

    var n = e.target.value.split("").filter((el) => {
      return "0" <= el && el <= "9";
    });
    //console.log(x)
    if (e.target.name === "fName") {
      this.setState({ fName: x.join("") });
    } else if (e.target.name === "lName") {
      this.setState({ lName: x.join("") });
    } else if (e.target.name === "Email") {
      this.setState({ email: x.join("") });
    }
    // console.log(e.target.value);
    else if (e.target.name === "Password") {
      this.setState({ pass: x.join("") });
    } else if (e.target.name === "conPass") {
      this.setState({ conPass: x.join("") });
    } else if (e.target.name === "phone") {
      this.setState({ phoneNum: n.join("") });
    }
    //   console.log(this.state.fName,this.state.lName,this.state.email,this.state.pass,this.state.conPass,this.state.phoneNum)
  }

  handleSubmit() {
    // console.log("Post")
    var inp = {
      firstname: this.state.fName,
      lastname: this.state.lName,
      email: this.state.email,
      password: this.state.pass,
      phonenumber: this.state.phoneNum,
    };
    fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inp),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data["status"] == "fail") {
          alert(data["detail"]);
        }
        if (data["status"] == "OK") {
          alert("Sign up complate : ลงทะเบียนสำเร็จ");
          this.props.history.push("/signIn");
        }
      });
  }

  render() {
    return (
      <div className="signUp">
        <div className="header">
          <div className="logo">
            <Link
              to={{ pathname: "https://www.netflix.com/th-en" }}
              target="_top"
            >
              {" "}
              <img src={logo} height="45px" />
            </Link>
          </div>
          <div style={{ alignSelf: "center", justifySelf: "right" }}>
            <DropdownButton
              id="dropdown-variants-Secondary"
              title={this.state.isEng ? "English" : "ไทย"}
              variant="secondary"
            >
              <Dropdown.Item
                value={false}
                onClick={this.setLang.bind(this)}
                name="lang_thai"
              >
                ไทย
              </Dropdown.Item>
              <Dropdown.Item
                value={true}
                onClick={this.setLang.bind(this)}
                name="lang_eng"
              >
                English
              </Dropdown.Item>
            </DropdownButton>
          </div>
          <button className="goLogin">
            {" "}
            <Link
              to={{ pathname: "/signIn" }}
              target="_top"
              style={{
                color: "white",
                textDecoration: "None",
                fontSize: "18px",
              }}
            >
              {this.state.isEng ? "Sign in" : "เข้าสู่ระบบ"}
            </Link>{" "}
          </button>
        </div>

        <div
          className="detail"
          style={{ alignSelf: "center", justifySelf: "center", alignItems: "" }}
        >
          <h2 style={{ paddingBottom: "30px" }}>
            {this.state.isEng ? "Sign Up" : "สมัครสมาชิก"}
          </h2>
          <form>
            <div className="gropInfo">
              <p className="word">{this.state.isEng ? "First Name" : "ชื่อ"}</p>
              <input
                type="text"
                className={
                  this.state.mesFirstName == "" ? "inp" : "inp-warnning"
                }
                name="fName"
                value={this.state.fName}
                autoComplete="off"
                onChange={this.onChangeHandler.bind(this)}
              ></input>
            </div>
            <p style={{ color: "#C67C03", fontSize: "small" }}>
              {this.state.mesFirstName}
            </p>

            <div className="gropInfo">
              <p className="word">
                {this.state.isEng ? "Last Name" : "นามสกุล"}
              </p>
              <input
                type="text"
                className={
                  this.state.mesLastName == "" ? "inp" : "inp-warnning"
                }
                name="lName"
                value={this.state.lName}
                autoComplete="off"
                onChange={this.onChangeHandler.bind(this)}
              ></input>
            </div>
            <p style={{ color: "#C67C03", fontSize: "small" }}>
              {this.state.mesLastName}
            </p>

            <div className="gropInfo">
              <p className="word">{this.state.isEng ? "Email" : "อีเมลล์"}</p>
              <input
                type="text"
                className={this.state.mesEmail == "" ? "inp" : "inp-warnning"}
                name="Email"
                value={this.state.email}
                autoComplete="off"
                onChange={this.onChangeHandler.bind(this)}
              ></input>
            </div>
            <p style={{ color: "#C67C03", fontSize: "small" }}>
              {this.state.mesEmail}
            </p>

            <div className="gropInfo">
              <p className="word">
                {this.state.isEng ? "Password" : "รหัสผ่าน"}
              </p>
              <input
                type="password"
                className={this.state.mesPass == "" ? "inp" : "inp-warnning"}
                name="Password"
                value={this.state.pass}
                onChange={this.onChangeHandler.bind(this)}
              ></input>
            </div>
            <p style={{ color: "#C67C03", fontSize: "small" }}>
              {this.state.mesPass}
            </p>

            <div className="gropInfo">
              <p className="word">
                {this.state.isEng ? "Comfirm Password" : "ยืนยันรหัสผ่าน"}
              </p>
              <input
                type="password"
                className={this.state.mesConPass == "" ? "inp" : "inp-warnning"}
                name="conPass"
                value={this.state.conPass}
                onChange={this.onChangeHandler.bind(this)}
              ></input>
            </div>
            <p style={{ color: "#C67C03", fontSize: "small" }}>
              {this.state.mesConPass}
            </p>

            <div className="gropInfo">
              <p className="word">
                {this.state.isEng ? "Phone Number" : "เบอร์โทรศัพท์"}
              </p>
              <input
                type="text"
                className={
                  this.state.mesPhoneNum == "" ? "inp" : "inp-warnning"
                }
                name="phone"
                value={this.state.phoneNum}
                autoComplete="off"
                onChange={this.onChangeHandler.bind(this)}
              ></input>
            </div>
            <p style={{ color: "#C67C03", fontSize: "small" }}>
              {this.state.mesPhoneNum}
            </p>
          </form>

          <button
            className={this.state.button_ena ? "confirm" : "confirm-active"}
            disabled={this.state.button_ena}
            onClick={this.handleSubmit.bind(this)}
          >
            {this.state.isEng ? "Sign Up" : "สมัครสมาชิก"}
          </button>
        </div>

        {/* ----------------------- footer -------------------------- */}
        <div className="footer">
          <p style={{ color: "gray", paddingLeft: "12%" }}>
            Questions? Call 1-800-012-298
          </p>
          <span style={{ margin: "20px 0px 20px 0px" }}>
            <Link
              to={{ pathname: "https://help.netflix.com/legal/giftterms" }}
              target="_top"
              className="info"
            >
              {this.state.isEng ? "Gift Card Terms" : "ข้อกำหนดบัตรของขวัญ"}
            </Link>
            <Link
              to={{ pathname: "https://help.netflix.com/legal/termsofuse" }}
              target="_top"
              className="info"
            >
              {this.state.isEng ? "Terms of Use" : "ข้อกำหนดการใช้งาน"}
            </Link>
            <Link
              to={{ pathname: "https://help.netflix.com/legal/privacy" }}
              target="_top"
              className="info"
            >
              {this.state.isEng
                ? "Privacy Statements"
                : "แนวทางปฏิบัติเกี่ยวกับความเป็นส่วนตัว"}
            </Link>
          </span>

          {/* <button onClick={()=>this.setState({isEng:!this.state.isEng})}>
            click Me
          </button> */}

          <DropdownButton
            id="dropdown-variants-Secondary"
            title={this.state.isEng ? "English" : "ไทย"}
            variant="secondary"
            style={{
              backgroundColor: "black",
              color: "gray",
              paddingLeft: "12%",
            }}
          >
            <Dropdown.Item
              value={false}
              onClick={this.setLang.bind(this)}
              name="lang_thai"
            >
              ไทย
            </Dropdown.Item>
            <Dropdown.Item
              value={true}
              onClick={this.setLang.bind(this)}
              name="lang_eng"
            >
              English
            </Dropdown.Item>
          </DropdownButton>
        </div>
      </div>
    );
  }
}

export default withCookies(signUp);
