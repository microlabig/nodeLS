/* eslint-disable */
const runCommand = require("./utils");
const dirTree = require("directory-tree");

const mock = require("mock-fs");

const APP_PATH = require.resolve("./main");

const delay = (ms) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
};

function format(entry) {
    if (typeof entry === "object") {
        try {
            return JSON.stringify(entry);
        } catch (e) { }
    }

    return entry;
}

function log(...msgs) {
    process.stdout.write(msgs.map(format).join(" ") + "\n");
}

describe("app: file system", () => {
    beforeEach(() => {
        mock({
            './src': mock.directory({
                items: {
                    from: {
                        folder1: {
                            'file1.txt': "text content 1",
                            'file2.txt': "text content 2"
                        },
                        folder2: {
                            inner_folder: {
                                'file3.txt': "text content 3"
                            }
                        },
                        'file0.txt': "text content 0"
                    }
                }

            })
        })
    });
    afterEach(mock.restore);

    it("create snapshot", async () => {
        const stdout = await runCommand(`${APP_PATH} from to --d`);

        mock.restore();
        expect(stdout).toMatchSnapshot();
    });

    it("creates sorted files", async () => {
        await runCommand(`${APP_PATH} from to --d`);
        await delay(2000);

        const tree = dirTree("./src", {}, null, (item, PATH, stats) => {
            //console.log(item);
        });

        log(tree);
        log('---');
        log(await runCommand(`cd ./src && ls -la`));
        //console.log(tree);
        mock.restore();
        expect(tree).toMatchSnapshot();
    });
});
