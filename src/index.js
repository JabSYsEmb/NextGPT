import addEventListeners from "./content-scripts/addEventListeners";
import eventDispatchers from "./content-scripts/eventDispatchers";
import { invoke } from "./utils";

addEventListeners();

invoke("auth");
invoke("proxy");

eventDispatchers();
