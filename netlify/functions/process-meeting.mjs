import apiHandler from "../../api/process-meeting.js";
import { runVercelStyleHandler } from "./_bridge.mjs";

export const handler = async (event) => runVercelStyleHandler(apiHandler, event);
