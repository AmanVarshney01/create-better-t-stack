export const getBadgeColors = (category: string): string => {
  switch (category) {
    case "webFrontend":
    case "nativeFrontend":
      return "border-primary/30 bg-primary/10 text-primary";
    case "runtime":
      return "border-accent/30 bg-accent/10 text-accent";
    case "backend":
      return "border-primary/40 bg-primary/15 text-primary";
    case "api":
      return "border-primary/50 bg-primary/20 text-primary";
    case "database":
      return "border-accent/40 bg-accent/15 text-accent";
    case "orm":
      return "border-primary/35 bg-primary/12 text-primary";
    case "auth":
      return "border-accent/35 bg-accent/12 text-accent";
    case "dbSetup":
      return "border-primary/30 bg-primary/10 text-primary";
    case "addons":
      return "border-accent/50 bg-accent/20 text-accent";
    case "examples":
      return "border-primary/40 bg-primary/15 text-primary";
    case "packageManager":
      return "border-muted-foreground/30 bg-muted text-muted-foreground";
    case "git":
    case "webDeploy":
    case "serverDeploy":
    case "install":
      return "border-muted-foreground/30 bg-muted text-muted-foreground";
    default:
      return "border-muted-foreground/30 bg-muted text-muted-foreground";
  }
};
