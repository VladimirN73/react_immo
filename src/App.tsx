import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BodyElement from "./components/Body";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="App">
      <Header />
      <BodyElement />
      <Footer />
    </div>
  );
}

export default App;
