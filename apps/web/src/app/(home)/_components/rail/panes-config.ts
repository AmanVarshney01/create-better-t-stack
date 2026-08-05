export type PaneDef = {
  id: string;
  label: string;
  title: string;
  width: string;
};

export const PANES: PaneDef[] = [
  { id: "pane-init", label: "init", title: "init", width: "min(92vw, 680px)" },
  { id: "pane-sponsors", label: "sponsors", title: "sponsors.json", width: "620px" },
  { id: "pane-videos", label: "videos", title: "videos/", width: "760px" },
  { id: "pane-tweets", label: "tweets", title: "tweets/", width: "560px" },
];
