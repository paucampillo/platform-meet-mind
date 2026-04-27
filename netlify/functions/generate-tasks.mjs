import apiHandler from "../../api/generate-tasks.js";
import { runVercelStyleHandler } from "./_bridge.mjs";

export const handler = async (event) => runVercelStyleHandler(apiHandler, event);
