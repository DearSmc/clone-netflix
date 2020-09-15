import React from "react";
// import { Link } from 'react-router';
import "./signIn.css";
// import { Route } from 'react-router-dom';
import { Link,Redirect,Route,Switch } from 'react-router-dom';
import logo from './assets/logo.png';
import FB_logo from './assets/FB_logo.png';
import validator from 'validator' 
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import 'bootstrap/dist/css/bootstrap.min.css';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { Prev } from "react-bootstrap/esm/PageItem";
import { createHashHistory } from 'history';

class signIn extends React.Component{
  
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

    constructor(prop){
      super(prop);
      const { cookies } = prop;
      //console.log(cookies.get("isEng"),this.state.isEng)
      this.state = {
        messageEmail:"",
        messagePass:"",
        Email:"",
        Pass:"",
        isEng: cookies.get('isEng')==='true'?true:false || false,
        key: cookies.get('key') || "unknow",
        button_ena: true
        
      }
    }
    onChangeHandler(e){
      // console.log(e.target.name);
      var x = e.target.value.split("").filter(el => {
        return ("A" <= el && el <= "Z")  || ("a" <= el && el <= "z") || ("0" <= el && el <= "9") ||
               ("!@#$%^&*()_+=-.".includes(el));
      })
      //console.log(x)
      if(e.target.name === "Email")
      {  
        this.setState({Email:x.join("")});
      } 
      // console.log(e.target.value);
      if(e.target.name === "Password")
      {  
        this.setState({Pass:x.join("")});
      } 
      
    }
    // shouldComponentUpdate(nextProps, nextState){
    //   return this.state.messageEmail !== nextState.messageEmail
    // }
    componentDidUpdate(prevProps,prevState){
      //console.log(prevState.Email,this.state.Email)
      if(prevState.Email !== this.state.Email) {
        this.cheakUser();

        if(this.state.Email.length>=8 && this.state.Pass.length>=4 && this.state.Pass.length<=60 && this.state.messageEmail=="" && this.state.messagePass=="") {
          this.setState({button_ena: false})
        }
        else {
          this.setState({button_ena: true})
        }
      } 
      if(prevState.Pass !== this.state.Pass) {
        this.cheakPass();

        if(this.state.Email.length>=8 && this.state.Pass.length>=4 && this.state.Pass.length<=60 && this.state.messageEmail=="" && this.state.messagePass=="") {
          this.setState({button_ena: false})
        }
        else {
          this.setState({button_ena: true})
        }
        // console.log(this.state.Pass,this.state.Pass.length)
      }

      if(prevState.isEng !== this.state.isEng) {
        this.cheakPass();
        this.cheakUser();
      }
    }
           
    validatePhoneNumber = (number) => {
        const isValidPhoneNumber = validator.isMobilePhone(number,['th-TH','uk-UA'])
        return (isValidPhoneNumber)
     }
  
    // componentDidMount(){
    //   const { cookies } = this.props;
    //   console.log("signIn.js (Did mount cookie.get('key')) =>",cookies.get('key')) 
    // }

    cheakUser(){   
      let message="";
      //console.log(this.state.Email)
      // console.log("cheak",this.state.isEng)
      if (this.state.Email.length===0){
        if(this.state.isEng)
          message="Please enter a valid email or phone number.";
        else
          message = "โปรดป้อนอีเมลหรือหมายเลขโทรศัพท์ที่ถูกต้อง";
      }
      else{
        if(!isNaN(this.state.Email))
        {
          if(!this.validatePhoneNumber(this.state.Email))
          {
            if(this.state.isEng)
              message = "Please enter a valid phone number.";
            else
              message = "โปรดป้อนหมายเลขโทรศัพท์ที่ถูกต้อง";
          }
        }
        else if (!((    (/^[a-zA-Z0-9_]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(this.state.Email)) || 
                        (/^[a-zA-Z0-9_]+@[a-zA-Z0-9]+\.[A-Za-z]+\.[a-zA-Z]+$/.test(this.state.Email))
                        ) && (this.state.Email.length>=8)))
        {
          if(this.state.isEng)
            message="Please enter a valid email.";
          else
            message = "โปรดป้อนอีเมลที่ถูกต้อง";
        }
      }
      this.setState({messageEmail:message});
     
    }

    cheakPass()
    {
      let message="";
      if(this.state.Pass.length<3 || this.state.Pass.length>60)
      {   
        if(this.state.isEng)
          message="Your password must contain between 4 and 60 characters."
        else
          message = "รหัสผ่านต้องมีจำนวนระหว่าง 4 ถึง 60 อักขระ";   
      }
      this.setState({messagePass:message});
    }
    
    setLang(event){
      // console.log(event.target.text)
      const { cookies } = this.props;
      if(event.target.name === "lang_thai")
      {
          this.setState({isEng: false})
          cookies.set('isEng', false);
      //     console.log(cookies.get('isEng'))
       }
      else if(event.target.name === "lang_eng")
      {
        this.setState({isEng: true})
        cookies.set('isEng', true);
        // console.log(cookies.get('isEng'))
      }  
      this.cheakPass();
      this.cheakUser();
    }
  
    handleSubmit()
    { 
      // console.log(this.state.Email, this.state.Pass)
      const history = createHashHistory()
      const { cookies } = this.props;
      var inp = {
        
        "username": this.state.Email,
        "password": this.state.Pass

      }
      fetch('http://localhost:5000/login', 
            {method: 'POST',headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(inp)})
      .then(response => response.json())
      .then(data => {
        // console.log(data)
        if(data['status'] === 'Fail') {
          alert(data['detail'])
        }
        if(data['status'] === 'OK'){
          // console.log("signIn.js (cookie.get('key')) => ", cookies.get('key'))
          cookies.remove('key', { path: '/' })
          cookies.set('key', data['key'], { path: '/' });
          // console.log("signIn.js (afterset cookie.get('key')) => ", cookies.get('key'))
          alert("Sign in complate : เข้าใช้งานสำเร็จ");
          // console.log(cookies.get('key'))
          this.props.history.push("/home");
          
            // <Redirect  to="/home" />
               
        }
      });
    }

    render(){
    return (
      <div className="signIn">
        {/* ---------------logo----------------- */}
        <div className="logo">
            <Link to={{pathname: "https://www.netflix.com/th-en"}} target="_top" ><img src={logo} height="45px"/></Link>
        </div>
        {/* ------------------------------------------------- */}


        <div className="content" >
          <h1 style={{ color: 'white', align: 'left', paddingBottom:'20px' ,fontSize:'34px' ,fontWeight:'bold'}}>{this.state.isEng? 'Sign In':'เข้าสู่ระบบ' }</h1>
          <div>
         
            {/* ----------------------------------- input ------------------------------------------ */}
            <input className={this.state.messageEmail===""? "input":"input-active"} type="text" placeholder={this.state.isEng? "Email or phone number":"อีเมลหรือหมายเลขโทรศัพท์"} name="Email" autoComplete='off' value={this.state.Email} onChange={this.onChangeHandler.bind(this)}/>
            <p style={{color:'#C67C03',fontSize:'small',padding:'5px'}} >{this.state.messageEmail}</p>
           
            <input className={this.state.messagePass===""? "input":"input-active"} type="password" placeholder={this.state.isEng? "Password":"รหัสผ่าน"} name="Password"  value={this.state.Pass} onChange={this.onChangeHandler.bind(this)}/>
            <p style={{color:'#C67C03',fontSize:'small',padding:'5px'}}>{this.state.messagePass}</p>
            {/* ------------------------------------------------------------------------------------ */}
            
            <input type="submit" value={this.state.isEng? "Sign In":"เข้าสู่ระบบ"} className= {this.state.button_ena?"submit":"submit-active"}  disabled={this.state.button_ena} onClick={this.handleSubmit.bind(this)}/>
            
            <div className="help">
                <input type="checkbox" style={{alignSelf:"baseline" }}/>
                <label style={{alignSelf:"baseline" ,paddingLeft: "2px"}} className="remember">{this.state.isEng? "  Remember me":"  จดจำข้อมูลของฉัน"} </label>
                <Link to={{ pathname: "https://www.netflix.com/th-en/LoginHelp" }} target="_top" style={{paddingLeft: this.state.isEng? '120px':'30px',alignSelf:"baseline"}} className="help" >{this.state.isEng? "Need help?":"หากต้องการความช่วยเหลือ"}</Link>
            </div>
          </div>
  
          <Link to={{ pathname: "" }} target="_top"  className="FB"><img src={FB_logo} height="18px"/>{this.state.isEng? "  Login with Facebook":"  เข้าสู่ระบบด้วย Facebook"}</Link>
          
          <span style={{color:'darkgray',padding:'10px 0px 10px 0px'}}>{this.state.isEng? "New to Netflix?": "หากยังใหม่กับการใช้ Netflix "}<Link to={{ pathname: "/signUp" }} target="_top" style={{color:'white',textDecoration:'none'}}>{this.state.isEng? " Sign up now.":" สมัครลงทะเบียนตอนนี้"}</Link></span>
          
          <small style={{color:'gray'}}>{this.state.isEng? "This page is protected by Google reCAPTCHA to ensure you're not a bot.":"หน้านี้ได้รับการป้องกันโดย Google reCAPTCHA เพื่อตรวจสอบว่าคุณไม่ใช่บ็อต"} <Link to={{ pathname: "" }} target="_top" style={{color:'rgb(33, 138, 199)',textDecoration:'none',fontSize:'small'}}>{this.state.isEng? "Learn more.":"เรียนรู้เพิ่มเติม"}</Link>
          </small>      
        </div>


        {/* ----------------------- footer -------------------------- */}
        <div className="footer">
          <p style={{color:'gray',paddingLeft:'12%'}}>Questions? Call 1-800-012-298</p>
          <span style={{margin:'20px 0px 20px 0px'}}>
            <Link to={{ pathname: "https://help.netflix.com/legal/giftterms"}} target="_top"  className="info">{this.state.isEng? "Gift Card Terms":"ข้อกำหนดบัตรของขวัญ"}</Link>
            <Link to={{ pathname: "https://help.netflix.com/legal/termsofuse"}} target="_top"  className="info">{this.state.isEng? "Terms of Use":"ข้อกำหนดการใช้งาน"}</Link>
            <Link to={{ pathname: "https://help.netflix.com/legal/privacy"}} target="_top"  className="info">{this.state.isEng? "Privacy Statements":"แนวทางปฏิบัติเกี่ยวกับความเป็นส่วนตัว"}</Link>
          </span>
  
          {/* <button onClick={()=>this.setState({isEng:!this.state.isEng})}>
            click Me
          </button> */}
          
          <DropdownButton id="dropdown-variants-Secondary" title={this.state.isEng? "English":"ไทย"} variant="secondary" style={{backgroundColor:'black',color:"gray",paddingLeft:'12%'}}>
            <Dropdown.Item value={false} onClick={this.setLang.bind(this)} name="lang_thai" >ไทย</Dropdown.Item>
            <Dropdown.Item value={true} onClick={this.setLang.bind(this)} name="lang_eng" >English</Dropdown.Item>
          </DropdownButton>
          
        </div>
      </div>
    );
  }
  }

export default withCookies(signIn);