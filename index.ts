import path from "path";
import fs from "fs";
import os from "os";
import { utimes } from "utimes";

if (os.platform() !== "win32") {
	console.error("FF13 only works on Windows");
	process.exit(1);
}

if (!process.env.LOCALAPPDATA) {
	console.error(`Environment variable LOCALAPPDATA is empty`);
	process.exit(1);
}

const destDir = path.resolve(
	process.env.LOCALAPPDATA,
	"SquareEnix/FinalFantasyXIII/save"
);
const srcDir = path.resolve(os.homedir(), "ff13-saves/default");

const parseArgs = () => {
	const args = process.argv.slice(2);

	if (args.length === 0 || args.some((arg) => arg === "all")) {
		return Array.from({ length: 13 }).map((_, i) => i + 1);
	}
	const numArgs = args.map((arg) => parseInt(arg));
	if (numArgs.some((n) => isNaN(n))) {
		return [];
	}
	return [...numArgs].sort((a, b) => a - b);
};

const readChapterSaves = async (chapter: number) => {
	const dir = path.join(
		path.join(srcDir, `ch${String(chapter).padStart(2, "0")}`)
	);
	try {
		const files = await fs.promises.readdir(dir);
		return [...files]
			.sort((a, b) => a.localeCompare(b))
			.map((file) => path.resolve(dir, file));
	} catch (error) {
		if (error.code === "ENOENT") {
			console.log("Creating", dir);
			await fs.promises.mkdir(dir, { recursive: true });
			return [];
		}
		throw error;
	}
};

const main = async () => {
	const chapters = parseArgs();
	let fileId = 0;
	for (const ch of chapters) {
		const saveFiles = await readChapterSaves(ch);
		for (const src of saveFiles) {
			const dest = path.resolve(
				destDir,
				`ff13-${String(fileId).padStart(2, "0")}.dat`
			);
			fs.copyFileSync(src, dest);
			await utimes(dest, {
				mtime: new Date(`${2000 + fileId}-01-01T00:00:00`).getTime(),
			});
			fileId += 1;
		}
	}
};

main().catch((error) => {
	console.error(error);
});
