import * as React from "react";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BodyElement from "./components/Body";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  React.useEffect(() => {
    document.addEventListener("keydown", function (event: any) {
      if (event.keyCode === 13 && event.target.nodeName === "INPUT") {
        var form = event.target.form;
        var index = Array.prototype.indexOf.call(form, event.target);
        form.elements[index + 2].focus();
        event.preventDefault();
      }
    });
  }, []);

  return (
    <div className="App">
      <Header />
      <BodyElement />
      <Footer />
    </div>
  );
}

export default App;
