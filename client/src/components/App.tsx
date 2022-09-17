import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import Editor from "./Editor";
import Terminal from "./Terminal";
import "./App.css";
import { v4 as uuidv4 } from "uuid";
import { ReflexContainer, ReflexSplitter, ReflexElement } from "react-reflex";
import "react-reflex/styles.css";

function App() {
  const backendUrl =
    process.env.NODE_ENV === "production"
      ? "https://codedamn-backend.herokuapp.com/"
      : "http://localhost:3001/";
  //State initailization
  const [htmlText, sethtmlText] = useState<string | undefined>(
    "<!--Write your html code here-->\r\n" +
      "<h1>Welcome to codedamn</h1>\r\n" +
      "\r\n" +
      "<p>Hey,there!</p>\r\n" +
      "<p>This is a HTML/CSS/JS playground!</p>\r\n" +
      "\r\n" +
      "<ul>\r\n" +
      "    <li>You can edit these files....!</li>\r\n" +
      "    <li>You can play with CSS/JS files</li>\r\n" +
      "    <li>You can resize the windows according to your requirement.</li>\r\n" +
      "</ul>\r\n" +
      "\r\n" +
      '<div class="current-date-time"></div>'
  );
  const [cssText, setcssText] = useState<string | undefined>(
    "/*Write your css code here*/\r\n" +
      "body{\r\n" +
      "    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;\r\n" +
      "    font-size: 1.4em\r\n" +
      "}\r\n" +
      "\r\n"
  );
  const [jsText, setjsText] = useState<string | undefined>(
    "//Write your javascript code here\r\n" +
      "\r\n" +
      "setInterval(function(){\r\n" +
      "    var dateNow = new Date();\r\n" +
      '    document.querySelector(".current-date-time").innerHTML = "Time right now: " + dateNow;\r\n' +
      "}, 1000);"
  );
  const [srcDoc, setsrcDoc] = useState("");
  const [currId, setcurrId] = useState<string | null>("");

  //Generating and setting user ID
  useEffect(() => {
    if (sessionStorage.getItem("currId"))
      setcurrId(sessionStorage.getItem("currId"));
    else {
      sessionStorage.setItem("currId", uuidv4());
      setcurrId(sessionStorage.getItem("currId"));
    }
  }, []);

  //Fetching code from backend
  useEffect(() => {
    if (currId) {
      axios
        .get(`${backendUrl}readcode`, {
          params: {
            id: currId,
          },
        })
        .then(function (response) {
          sethtmlText(response.data.htmlText);
          setcssText(response.data.cssText);
          setjsText(response.data.jsText);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [currId]);

  //Updating changes to iframe every 250ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setsrcDoc(`
      <html>
        <body>${htmlText}</body>
        <style>${cssText}</style>
        <script>${jsText}</script>
      </html>
      `);
    }, 250);
    return () => clearTimeout(timer);
  }, [htmlText, cssText, jsText]);

  return (
    <div className="app">
      <div>
        <Header />
      </div>
      <div className="all-components">
        <ReflexContainer orientation="vertical">
          {/* for editor and terminal */}
          <ReflexElement className="left-pane " flex={0.69}>
            <div className="" style={{ height: "100vh" }}>
              <ReflexContainer orientation="horizontal">
                <ReflexElement flex={0.6} className="left-top-pane editor-div">
                  <div className="">
                    <Editor
                      currId={currId}
                      htmlText={htmlText}
                      sethtmlText={sethtmlText}
                      cssText={cssText}
                      setcssText={setcssText}
                      jsText={jsText}
                      setjsText={setjsText}
                    />
                  </div>
                </ReflexElement>
                <ReflexSplitter className="reflex-splitter-horizontal" />
                <ReflexElement className="left-bottom-pane terminal-div">
                  <Terminal />
                </ReflexElement>
              </ReflexContainer>
            </div>
          </ReflexElement>
          <ReflexSplitter className="reflex-splitter-vertical" />
          {/* for iframe */}
          <ReflexElement className="right-pane html-div">
            <iframe
              srcDoc={srcDoc}
              title="output"
              sandbox="allow-scripts"
              frameBorder="0"
              width="100%"
              height="100%"
            />
          </ReflexElement>
        </ReflexContainer>
      </div>
    </div>
  );
}

export default App;
