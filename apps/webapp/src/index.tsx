/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";
import "./index.css";

const root = document.querySelector("html");

render(() => <App />, root!);
