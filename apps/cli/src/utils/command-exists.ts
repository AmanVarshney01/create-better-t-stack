import { execa } from "execa";

export async function commandExists(command: string) {
	try {
		const isWindows = process.platform === "win32";
		if (isWindows) {
			const result = await execa("where", [command]);
			return result.exitCode === 0;
		}

		const result = await execa("which", [command]);
		return result.exitCode === 0;
	} catch {
		return false;
	}
}
