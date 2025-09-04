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

    const uuid = dc.useMemo(() => self.crypto.randomUUID(), []);

    const path = element.$file;
    const { start, end } = element.$position;
    const created = element.value("created");

    const workspace = dc.app.workspace;
    if (!workspace) throw new Error("No workspace found");
    const onTimestampClick = dc.useCallback(
        (event) => workspace.openLinkText(path, path, event.shiftKey),
        [path, workspace]
    );

    const elementStatus = element.value("status");
    const inputName = `page-status-${uuid}`;
    const [pageStatus, setPageStatus] = dc.useState(() => elementStatus ?? "tweet");
    const file = dc.core.vault.getFileByPath(path);
    if (!file) throw new Error("No Matching TFile");

    dc.useEffect(() => {
        setPageStatus(elementStatus ?? "tweet");
    }, [elementStatus]);

    dc.useEffect(() => {
        if (elementStatus === pageStatus) return;
        dc.app.fileManager.processFrontMatter(file, (frontmatter) => {
            frontmatter.status = pageStatus;
        });
    }, [pageStatus, file, elementStatus]);

    const STATUS_OPTIONS = [
        { value: "tweet", label: "🕊" },
        { value: "now", label: "🎯" },
        { value: "task", label: "📋" },
        { value: "later", label: "⌛" },
        { value: "done", label: "✅" },
    ];

    return (
        <div className="personalized-embed" key={uuid}>
            <div className="personalized-embed-header">
                <h2 onClick={onTimestampClick}>{created.toFormat("HH:mm:ss")}</h2>
                <fieldset>
                    {STATUS_OPTIONS.map(({ value, label }) => (
                        <dc.preact.Fragment key={value}>
                            <input
                                type="radio"
                                id={`choice-${value}`}
                                name={inputName}
                                value={value}
                                checked={pageStatus === value}
                                onChange={() => setPageStatus(value)}
                            />
                            <label htmlFor={`choice-${value}`}>{label}</label>
                        </dc.preact.Fragment>
                    ))}
                </fieldset>
            </div>

            <dc.SpanEmbed path={path} start={start} end={end} showExplain={false} />
        </div>
    );
}
