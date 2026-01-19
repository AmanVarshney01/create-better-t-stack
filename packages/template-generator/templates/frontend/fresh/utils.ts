import { createDefine } from "$fresh/server.ts";

export interface State {
  // Add your state properties here
  title?: string;
}

export const define = createDefine<State>();
