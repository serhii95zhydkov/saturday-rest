// import "./css/serhii.css";
import "./css/andrii.scss";

console.log("Hello from Serhii Webpack!");

import artem from "./js/artem";
import tanya from "./js/tanya";

console.log(artem);
console.log(tanya);

class User {
  #name;
  constructor(name) {
    this.#name = name;
  }
  getInfo() {
    console.log(this.#name);
  }
}

const maryna = new User("Maryna");

maryna.getInfo();
