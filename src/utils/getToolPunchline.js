import { TOOL_PUNCHLINES } from "../constants/toolPunchlines";

export function getRandomToolPunchline() {
  const i = Math.floor(Math.random() * TOOL_PUNCHLINES.length);
  return TOOL_PUNCHLINES[i];
}
