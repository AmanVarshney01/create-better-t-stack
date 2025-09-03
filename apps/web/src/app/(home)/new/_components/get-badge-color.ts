export const getBadgeColors = (category: string): string => {
	switch (category) {
		case "webFrontend":
		case "nativeFrontend":
			return "border-blue-300 bg-blue-100 text-blue-800 dark:border-blue-700/30 dark:bg-blue-900/30 dark:text-blue-300";
		case "runtime":
			return "border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-700/30 dark:bg-amber-900/30 dark:text-amber-300";
		case "backend":
			return "border-sky-300 bg-sky-100 text-sky-800 dark:border-sky-700/30 dark:bg-sky-900/30 dark:text-sky-300";
		case "api":
			return "border-indigo-300 bg-indigo-100 text-indigo-800 dark:border-indigo-700/30 dark:bg-indigo-900/30 dark:text-indigo-300";
		case "database":
			return "border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-700/30 dark:bg-emerald-900/30 dark:text-emerald-300";
		case "orm":
			return "border-cyan-300 bg-cyan-100 text-cyan-800 dark:border-cyan-700/30 dark:bg-cyan-900/30 dark:text-cyan-300";
		case "auth":
			return "border-green-300 bg-green-100 text-green-800 dark:border-green-700/30 dark:bg-green-900/30 dark:text-green-300";
		case "dbSetup":
			return "border-pink-300 bg-pink-100 text-pink-800 dark:border-pink-700/30 dark:bg-pink-900/30 dark:text-pink-300";
		case "addons":
			return "border-violet-300 bg-violet-100 text-violet-800 dark:border-violet-700/30 dark:bg-violet-900/30 dark:text-violet-300";
		case "examples":
			return "border-teal-300 bg-teal-100 text-teal-800 dark:border-teal-700/30 dark:bg-teal-900/30 dark:text-teal-300";
		case "packageManager":
			return "border-orange-300 bg-orange-100 text-orange-800 dark:border-orange-700/30 dark:bg-orange-900/30 dark:text-orange-300";
		case "git":
		case "webDeploy":
		case "serverDeploy":
		case "install":
			return "border-gray-300 bg-gray-100 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400";
		default:
			return "border-gray-300 bg-gray-100 text-gray-800 dark:border-gray-700/30 dark:bg-gray-900/30 dark:text-gray-300";
	}
};
