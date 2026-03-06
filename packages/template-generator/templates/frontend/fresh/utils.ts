import { createDefine } from "fresh";

export interface State {
  siteName: string;
}

export const define = createDefine<State>();
