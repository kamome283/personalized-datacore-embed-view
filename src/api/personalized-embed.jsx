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

    return (
        <div className="personalized-embed">
            <h2 onClick={onTimestampClick}>{created.toFormat("HH:mm:ss")}</h2>
            <dc.SpanEmbed path={path} start={start} end={end} showExplain={false} />
        </div>
    );
}
