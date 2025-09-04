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
        return `page-type-${self.crypto.randomUUID()}`;
    }, []);
    const [pageType, setPageType] = dc.useState(() => element.value("status") ?? "tweet");
    const file = dc.core.vault.getFileByPath(path);
    if (!file) throw new Error("No Matching TFile");

    dc.useEffect(() => {
        dc.app.fileManager.processFrontMatter(file, (frontmatter) => {
            frontmatter.status = pageType;
        });
    }, [pageType]);

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
                        checked={pageType === "tweet"}
                        onChange={() => setPageType("tweet")}
                    />
                    <label for="choice-tweet">🕊</label>

                    <input
                        type="radio"
                        id="choice-now"
                        name={inputName}
                        value="now"
                        checked={pageType === "now"}
                        onChange={() => setPageType("now")}
                    />
                    <label for="choice-now">🎯</label>

                    <input
                        type="radio"
                        id="choice-task"
                        name={inputName}
                        value="task"
                        checked={pageType === "task"}
                        onChange={() => setPageType("task")}
                    />
                    <label for="choice-task">📋</label>

                    <input
                        type="radio"
                        id="choice-later"
                        name={inputName}
                        value="later"
                        checked={pageType === "later"}
                        onChange={() => setPageType("later")}
                    />
                    <label for="choice-later">⌛</label>

                    <input
                        type="radio"
                        id="choice-done"
                        name={inputName}
                        value="done"
                        checked={pageType === "done"}
                        onChange={() => setPageType("done")}
                    />
                    <label for="choice-done">✅</label>
                </fieldset>
            </div>

            <dc.SpanEmbed path={path} start={start} end={end} showExplain={false} />
        </div>
    );
}
