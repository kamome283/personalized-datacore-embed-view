function PersonalizedPageEmbed(element) {
    if (!element.$types.contains("page")) {
        throw new Error("Not a page");
    }
    if (!element.$file) {
        throw new Error("Does not have file property");
    }
    if (!element.$position) {
        throw new Error("Does not have position property");
    }
    if (!element.value("created")) {
        throw new Error("Does not have created property");
    }

    const path = element.$file;
    const { start, end } = element.$position;
    const created = element.value("created");

    const workspace = dc.app.workspace;
    if (!workspace) throw new Error("No workspace found");
    const onTimestampClick = dc.useCallback(
        (event) => workspace.openLinkText(path, path, event.shiftKey),
        [path, workspace]
    );

    const inputName = dc.useMemo(() => {
        return `page-status-${self.crypto.randomUUID()}`;
    }, []);
    const [pageStatus, setPageStatus] = dc.useState(() => element.value("status") ?? "tweet");
    const file = dc.core.vault.getFileByPath(path);
    if (!file) throw new Error("No Matching TFile");

    dc.useEffect(() => {
        dc.app.fileManager.processFrontMatter(file, (frontmatter) => {
            frontmatter.status = pageStatus;
        });
    }, [pageStatus]);

    return (
        <div className="personalized-embed">
            <div className="personalized-embed-header">
                <h2 onClick={onTimestampClick}>{created.toFormat("HH:mm:ss")}</h2>
                <fieldset>
                    <input
                        type="radio"
                        id="choice-tweet"
                        name={inputName}
                        value="tweet"
                        checked={pageStatus === "tweet"}
                        onChange={() => setPageStatus("tweet")}
                    />
                    <label for="choice-tweet">🕊</label>

                    <input
                        type="radio"
                        id="choice-now"
                        name={inputName}
                        value="now"
                        checked={pageStatus === "now"}
                        onChange={() => setPageStatus("now")}
                    />
                    <label for="choice-now">🎯</label>

                    <input
                        type="radio"
                        id="choice-task"
                        name={inputName}
                        value="task"
                        checked={pageStatus === "task"}
                        onChange={() => setPageStatus("task")}
                    />
                    <label for="choice-task">📋</label>

                    <input
                        type="radio"
                        id="choice-later"
                        name={inputName}
                        value="later"
                        checked={pageStatus === "later"}
                        onChange={() => setPageStatus("later")}
                    />
                    <label for="choice-later">⌛</label>

                    <input
                        type="radio"
                        id="choice-done"
                        name={inputName}
                        value="done"
                        checked={pageStatus === "done"}
                        onChange={() => setPageStatus("done")}
                    />
                    <label for="choice-done">✅</label>
                </fieldset>
            </div>

            <dc.SpanEmbed path={path} start={start} end={end} showExplain={false} />
        </div>
    );
}
