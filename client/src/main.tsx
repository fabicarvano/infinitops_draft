import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

document.title = "CCO - Centro de Controle de Operações";

createRoot(document.getElementById("root")!).render(<App />);
