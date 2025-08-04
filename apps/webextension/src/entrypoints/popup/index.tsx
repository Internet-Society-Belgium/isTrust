import { render } from "solid-js/web";
import App from "./App";
import "./index.css";

const root = document.querySelector("body");

render(() => <App />, root!);
