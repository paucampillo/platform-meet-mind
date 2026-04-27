import apiHandler from "../../api/analyze-transcript.js";
import { runVercelStyleHandler } from "./_bridge.mjs";

export const handler = async (event) => runVercelStyleHandler(apiHandler, event);
