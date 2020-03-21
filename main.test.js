/* eslint-disable */
const runCommand = require("./utils");
const dirTree = require("directory-tree");

const mock = require("mock-fs");

const APP_PATH = require.resolve("./main");

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
        const tree = dirTree("./src");

        mock.restore();
        console.log(tree);

        expect(tree).toMatchSnapshot();
    });
});
