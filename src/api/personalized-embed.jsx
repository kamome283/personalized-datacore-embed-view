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
    const { start, end } = element.$position;
    const created = element.value("created");
    return (
        <div className="personalized-embed">
            <h2>{created.toFormat("HH:mm:ss")}</h2>
            <dc.SpanEmbed path={element.$file} start={start} end={end} showExplain={false} />
        </div>
    );
}
