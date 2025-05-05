import { TemplateProvider } from "./context/TemplateContext";
import LandingPageContainer from "./containers/LandingPage/LandingPageContainer";
import "./App.css";

function App() {
  return (
    <TemplateProvider>
      <div className="app">
        <LandingPageContainer />
      </div>
    </TemplateProvider>
  );
}

export default App;
