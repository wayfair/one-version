const {
	getWorkspacesForPackageManager,
	_getWorkspacesPNPM,
	_getWorkspacesYarnClassic,
	_getWorkspacesYarnBerry,
} = require("../get-workspaces");
const { NO_PACKAGE_MANAGER } = require("../constants");

describe("getWorkspaces", () => {
	it("throws if invalid package manager", () => {
		expect(() => {
			getWorkspacesForPackageManager("fake");
		}).toThrow(`${NO_PACKAGE_MANAGER} fake`);
	});
});

describe("_getWorkspacesPNPM", () => {
	it("calls exec w/ expected command", () => {
		const execMock = jest.fn();
		execMock.mockReturnValue("[]");
		_getWorkspacesPNPM({ execSync: execMock });
		expect(execMock).toHaveBeenCalledWith("pnpm list -r --json --depth -1", {
			encoding: "utf8",
		});
	});
});

describe("_getWorkspacesYarnClassic", () => {
	it("calls exec w/ expected command", () => {
		const execMock = jest.fn();
		execMock.mockReturnValue("[]");
		_getWorkspacesYarnClassic({ execSync: execMock });
		expect(execMock).toHaveBeenCalledWith("yarn --silent workspaces info", {
			encoding: "utf8",
		});
	});
});

describe("_getWorkspacesYarnBerry", () => {
	it("calls exec w/ expected command", () => {
		const execMock = jest.fn();
		execMock.mockReturnValue("");
		_getWorkspacesYarnBerry({ execSync: execMock });
		expect(execMock).toHaveBeenCalledWith("yarn workspaces list --json", {
			encoding: "utf8",
		});
	});
});
