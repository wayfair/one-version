const { detectPackageManager } = require("../detect-package-manager");

const fs = require("fs");

jest.mock("fs", () => ({
	...jest.requireActual("fs"),
	existsSync: jest.fn(),
}));

describe("detectPackageManager", () => {
	it("returns pnpm if pnpm-lock.yml exists", () => {
		// first check for yarn.lock, then pnpm
		fs.existsSync.mockReturnValueOnce(false).mockReturnValueOnce(true);
		const packageManager = detectPackageManager();
		expect(packageManager).toBe("pnpm");
	});

	it("returns yarn if yarn.lock exists", () => {
		// first check for yarn.lock, then yarnrc
		fs.existsSync.mockReturnValueOnce(true).mockReturnValueOnce(false);
		const packageManager = detectPackageManager();
		expect(packageManager).toBe("yarn");
	});

	it("returns berry if yarn.lock and .yarnrc.yml exist", () => {
		// first check for yarn.lock, then yarnrc
		fs.existsSync.mockReturnValueOnce(true).mockReturnValueOnce(true);
		const packageManager = detectPackageManager();
		expect(packageManager).toBe("berry");
	});

	it("returns empty if package manager is not detected", () => {
		// first check for yarn.lock, then pnpm
		fs.existsSync.mockReturnValueOnce(false).mockReturnValueOnce(false);
		const packageManager = detectPackageManager();
		expect(packageManager).toBe("");
	});
});
