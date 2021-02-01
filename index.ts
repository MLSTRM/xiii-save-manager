import path from "path";
import fs from "fs";
import os from "os";

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
	const location = parseSteamLocationIfPresent(args);
	const chapters = parseChapters(location ? args.slice(2) : args);
	return {
		chapters,
		location
	};
};

function parseSteamLocationIfPresent(args: any[]): string | undefined {
	if(args && args.length>0) {
		const steamProperty = args.find(e => e === '--steam');
		if(steamProperty){
			const index = args.indexOf(steamProperty);
			if(index !== 0){
				console.error("--steam flag must be specified at the start of the command, followed by the path to steam userdata directory, then chapters as normal");
				process.exit(1);
			}
			if(args.length == index+1){
				console.error("--steam flag supplied but no path to steam userdata directory was given");
				process.exit(1);
			}
			const steamLocation = args[index+1];
			return path.resolve(steamLocation, '292120/remote');
		}
	}
	return undefined;
}

function parseChapters(args: any[]): number[] {
	if (args.length === 0 || args.some((arg) => arg === "all")) {
		return Array.from({ length: 13 }).map((_, i) => i + 1);
	}
	const numArgs = args.map((arg) => parseInt(arg));
	if (numArgs.some((n) => isNaN(n))) {
		return [];
	}
	return [...numArgs].sort((a, b) => a - b);
}

const readChapterSaves = (chapter: number) => {
	const dir = path.join(
		path.join(srcDir, `ch${String(chapter).padStart(2, "0")}`)
	);
	try {
		const files = fs.readdirSync(dir);
		return [...files]
			.sort((a, b) => a.localeCompare(b))
			.map((file) => path.resolve(dir, file));
	} catch (error) {
		if (error.code === "ENOENT") {
			console.log("Creating", dir);
			fs.mkdirSync(dir, { recursive: true });
			return [];
		}
		throw error;
	}
};

const main = () => {
	const {chapters, location} = parseArgs();
	let timestamp = Date.now();
	let fileId = 0;
	for (const ch of chapters) {
		const saveFiles = readChapterSaves(ch);
		for (const src of saveFiles) {
			const dest = path.resolve(
				location ?? destDir,
				`ff13-${String(fileId).padStart(2, "0")}.dat`
			);
			fs.copyFileSync(src, dest);
			fs.utimesSync(
				dest,
				new Date(timestamp + fileId * 1000 * 60),
				new Date(timestamp + fileId * 1000 * 60)
			);
			fileId += 1;
		}
	}
};

main();
