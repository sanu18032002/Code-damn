import { Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";
import "./Editor.css";
import axios from "axios";
import { FaHtml5, FaCss3, FaJsSquare } from "react-icons/fa";

interface IProps {
  currId: string | null;
  htmlText: string | undefined;
  sethtmlText: React.Dispatch<React.SetStateAction<string | undefined>>;
  cssText: string | undefined;
  setcssText: React.Dispatch<React.SetStateAction<string | undefined>>;
  jsText: string | undefined;
  setjsText: React.Dispatch<React.SetStateAction<string | undefined>>;
}
function Editor(props: IProps) {
  const backendUrl =
    process.env.NODE_ENV === "production"
      ? "https://codedamn-backend.herokuapp.com/"
      : "http://localhost:3001/";
  const options = {
    selectOnLineNumbers: true,
    fontSize: 16,
  };
  const [currFile, setcurrFile] = useState<string>("HTML");
  //Send code to backend every 2.5secs
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (props.currId) {
        axios
          .post(`${backendUrl}code`, {
            htmlText: props.htmlText,
            cssText: props.cssText,
            jsText: props.jsText,
            currId: props.currId,
          })
          .then(function (response) {})
          .catch(function (error) {
            console.log(error);
          });
      }
    }, 2500);

    return () => clearTimeout(timeout);
  }, [props.currId, props.htmlText, props.cssText, props.jsText]);

  return (
    <div>
      <div className="select-file">
        <Button
          size="large"
          name="HTML"
          value={currFile}
          onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
            setcurrFile(e.currentTarget.name)
          }
          className={currFile === "HTML" ? "btn-selected" : "btn-not-selected"}
        >
          <FaHtml5 size="20" color="#e34f26" />
        </Button>
        <Button
          size="large"
          name="CSS"
          value={currFile}
          onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
            setcurrFile(e.currentTarget.name)
          }
          style={
            currFile === "CSS"
              ? {
                  backgroundColor: "#454545",
                  borderRight: "2px solid black",
                  color: "white",
                }
              : {
                  backgroundColor: "#232323",
                  borderRight: "2px solid black",
                  color: "white",
                }
          }
        >
          <FaCss3 size="20" color="#2965f1" />
        </Button>
        <Button
          size="large"
          name="JS"
          value={currFile}
          onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
            setcurrFile(e.currentTarget.name)
          }
          style={
            currFile === "JS"
              ? {
                  backgroundColor: "#454545",
                  borderRight: "2px solid black",
                  color: "white",
                }
              : {
                  backgroundColor: "#232323",
                  borderRight: "2px solid black",
                  color: "white",
                }
          }
        >
          <FaJsSquare size="20" color="#f0db4f" />
        </Button>
      </div>
      <div className="editor">
        {currFile === "HTML" && (
          <MonacoEditor
            language="html"
            theme="vs-dark"
            value={props.htmlText}
            onChange={(v, event) => props.sethtmlText(v)}
            options={options}
          />
        )}
        {currFile === "CSS" && (
          <MonacoEditor
            language="css"
            theme="vs-dark"
            value={props.cssText}
            onChange={(v, event) => props.setcssText(v)}
            options={options}
          />
        )}
        {currFile === "JS" && (
          <MonacoEditor
            language="javascript"
            theme="vs-dark"
            value={props.jsText}
            onChange={(v, event) => props.setjsText(v)}
            options={options}
          />
        )}
      </div>
    </div>
  );
}
export default Editor;
