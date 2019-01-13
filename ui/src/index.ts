import "@babel/polyfill";
import { renderApp, router } from "./components/App";


// start router
router.start(renderApp);
