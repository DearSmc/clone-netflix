const validator = require("validator");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
const { match } = require("assert");
app.use(bodyParser.json({ limit: "1mb" }));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
var userData = [];

app.get("/getuserall", (req, res) => {
  res.json(userData);
});

app.post("/register", (req, res) => {
  // console.log(req.body)
  var duplicate = false;
  var cheak = true;

  userData.forEach((element) => {
    if (element.email === req.body.email) {
      console.log("Duplicate");
      duplicate = true;
      res.json({ status: "fail", detail: "duplicate!" });
    }
  });

  // ----------------------------varidation-----------------------------
  if (req.body["firstname"].length < 1) {
    res.json({ status: "fail", detail: "Firstname incorect!" });
    cheak = false;
  }

  if (req.body["lastname"].length < 1) {
    res.json({ status: "fail", detail: "Lastname incorect!" });
    cheak = false;
  }
  
  if (!((    (/^[a-zA-Z0-9_]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(req.body["email"])) || 
              (/^[a-zA-Z0-9_]+@[a-zA-Z0-9]+\.[A-Za-z]+\.[a-zA-Z]+$/.test(req.body["email"]))
              ) && (req.body["email"].length>=8)))
  {
  // if (!/^[a-zA-Z0-9_]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(req.body["email"])) {
    res.json({ status: "fail", detail: "Email incorect!" });
    cheak = false;
  }
  if (req.body["password"].length < 4 || req.body["password"].length >= 60) {
    res.json({ status: "fail", detail: "Password incorect!" });
    cheak = false;
  }

  if (!validator.isMobilePhone(req.body["phonenumber"], ["th-TH", "uk-UA"])) {
    res.json({ status: "fail", detail: "Phone Number incorect!" });
    cheak = false;
  }
  //--------------------------------------------------------------------------------------

  if (!duplicate && cheak) {
    data = {
      firstname: req.body["firstname"],
      lastname: req.body["lastname"],
      email: req.body["email"],
      password: req.body["password"].hashCode(),
      phonenumber: req.body["phonenumber"],
      key: "unknow",
    };
    userData.push(data);
    try {
      fs.writeFileSync("user.json", JSON.stringify(userData));
      console.log("JSON data is saved.");
      res.json({ status: "OK" });
    } catch (error) {
      console.error(error);
      res.json({ status: "Fail" });
    }
  }
});

app.post("/login", (req, res) => {
  
 
  var match = false;
  
  userData.forEach((element) => {
    if (
      (element.email === req.body["username"] ||
        element.phonenumber === req.body["username"]) &&
      element.password === req.body["password"].hashCode()
    ) {
      match = true;
    }
  });

  if (!match) {
    res.json({ status: "Fail", detail: "Something wrong!" });
  } else {
    var rand = require("random-key");
    newKey = rand.generate(10);

    var sameKey = (newKey) => {
      userData.forEach((element) => {
        if (element.key === newKey) {
          return true;
        }
      });
      return false;
    };

    while (sameKey(newKey)) {
      newKey = rand.generate(10);
      sameKey = (newKey) => {
        userData.forEach((element) => {
          if (element.key === newKey) {
            return true;
          }
        });
        return false;
      };
    }

    userData.forEach((element) => {
      if (
        (element.email === req.body["username"] ||
          element.phonenumber === req.body["username"]) &&
        element.password === req.body["password"].hashCode()
      )
        element.key = newKey;
    });

    try {
      fs.writeFileSync("user.json", JSON.stringify(userData));
      console.log("JSON data is saved.");
      console.log("login");
      res.json({ status: "OK", key: newKey });
    } catch (error) {
      console.error(error);
      res.json({ status: "Fail" });
    }
  }
});

app.post("/getdata" , (req, res) => {

  var match = false
  // console.log(req.body['key'])
  if(req.body['key'] != "unknow")
  {
    userData.forEach((element) => {
        if (element.key === req.body["key"] )
        {  
            // console.log(req.body['key'],element.firstname)
            res.json({'status':'OK', firstname: element.firstname,  lastname:element.lastname,  email:element.email,  phonenumber:element.phonenumber});
            match = true
            // console.log("key match")
        }
    });
  }
  
  if(!match)
      res.json({ status: "Fail" ,detail: "not match key"});

});

app.post("/logout", (req, res) => {
  var match = false;
  
  userData.forEach((element) => {
    if (element.key === req.body['key'])
    {
      match = true;
      element.key = "unknow";
      res.json({ status:"OK"});
  
    }
  });

  if (!match) {
    res.json({ status: "Fail", detail: "Don't have key" });
  } 

  
});

Object.defineProperty(String.prototype, 'hashCode', {
  value: function() {
    var hash = 0, i, chr;
    for (i = 0; i < this.length; i++) {
      chr   = this.charCodeAt(i);
      hash  = ((hash << 12) - hash) + chr + 12;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }
});

function readDatabase() {
  try {
    fs.readFile("user.json", "utf-8", (err, data) => {
      if (err) {
        throw err;
      }
      // parse JSON object
      try {
        userData = JSON.parse(data.toString());
        console.log(userData);
      } catch (err) {}
    });
  } catch (err) {}
}

app.listen(5000, () => {
  readDatabase();
  console.log("Sever at port 5000");
  // console.log("qweqwe".hashCode() === "Heweweello".hashCode())
  // console.log("Heweweello".hashCode())
});
