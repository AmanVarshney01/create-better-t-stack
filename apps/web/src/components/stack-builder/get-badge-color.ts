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
    case "payments":
      return "border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400";
    case "email":
      return "border-gray-500/30 bg-gray-500/10 text-gray-600 dark:text-gray-400";
    case "dbSetup":
      return "border-primary/30 bg-primary/10 text-primary";
    case "cssFramework":
      return "border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400";
    case "uiLibrary":
      return "border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400";
    case "backendLibraries":
      return "border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400";
    case "codeQuality":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    case "documentation":
      return "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400";
    case "appPlatforms":
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
