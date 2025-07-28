import { log } from "@clack/prompts";
import { execa } from "execa";

export async function openUrl(url: string) {
	const platform = process.platform;
	let command: string;
	let args: string[] = [];

	if (platform === "darwin") {
		command = "open";
		args = [url];
	} else if (platform === "win32") {
		command = "cmd";
		args = ["/c", "start", "", url.replace(/&/g, "^&")];
	} else {
		command = "xdg-open";
		args = [url];
	}

	try {
		await execa(command, args, { stdio: "ignore" });
	} catch {
		log.message(`Please open ${url} in your browser.`);
	}
}
