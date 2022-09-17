import React, { useEffect, useState, useRef } from "react";
import { XTerm } from "xterm-for-react";
import "./Terminal.css";
import c from "ansi-colors";

function Terminal() {
  const xtermRef: any = useRef(null);
  const [currCommand, setcurrCommand] = useState<string>("$");
  useEffect(() => {
    xtermRef.current.terminal.writeln(
      `Terminal for basic mathematical calulations. ${c.bold.yellow(
        "clear"
      )} command to reset the terminal`
    );
  }, []);
  console.log(currCommand);

  return (
    <div>
      <XTerm
        className="terminal-xterm"
        options={{
          lineHeight: 2,
          cols: 100,
          rows: 5,
          fontSize: 18,
          cursorStyle: "underline",
          cursorBlink: true,
        }}
        //for a new line
        onLineFeed={() => {
          xtermRef.current.terminal.write(
            c.bold.greenBright("CodeIt-Terminal:~ $  ")
          );
          if (currCommand !== "$" && currCommand !== "$clear") {
            try {
              xtermRef.current.terminal.writeln(
                JSON.stringify(eval(currCommand.substr(1, currCommand.length)))
              );
            } catch (error) {
              xtermRef.current.terminal.writeln(
                c.bold.red("Command not found")
              );
            }
            setcurrCommand("$");
          }
          if (currCommand === "$clear") {
            xtermRef.current.terminal.clear();
            setcurrCommand("$");
          }
        }}
        //handle each key press
        onKey={(event: { key: string; domEvent: KeyboardEvent }) => {
          //new line for enter key
          if (event.key.charCodeAt(0) === 13) {
            xtermRef.current.terminal.write("\n");
          }
          //handle backspace
          else if (event.domEvent.key === "Backspace") {
            if (currCommand.charAt(currCommand.length - 1) !== "$") {
              setcurrCommand((currCommand) =>
                currCommand.substr(0, currCommand.length - 1)
              );
              xtermRef.current.terminal.write("\b \b");
            }
          }
          //all other keys
          else {
            if (event.key.charCodeAt(0) !== 27)
              setcurrCommand((currCommand) => currCommand + event.key);
          }
          xtermRef.current.terminal.write(event.key);
        }}
        ref={xtermRef}
      />
    </div>
  );
}

export default Terminal;
