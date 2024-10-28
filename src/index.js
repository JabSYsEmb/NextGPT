import addEventListeners from "./content-scripts/addEventListeners";
import eventDispatchers from "./content-scripts/eventDispatchers";
import { invoke } from "./utils";

/**
 * dipatches depends on actions therefore we need to invoke actions first
 */
const { actions, dispatches } = addEventListeners();

actions.forEach((action) => invoke(action));

/**
 * dispatches events keep them at the end of the script
 */
dispatches.forEach((dispatch) => eventDispatchers(dispatch));
