import { STATUS_OPTIONS } from "../constants/status-options";

export function PersonalizedPageEmbed(element) {
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

    // コンポーネントの初回作成時に一意で更新されないUUIDを付与
    // キーなど一意性が必要な場所で用いる
    const uuid = dc.useMemo(() => self.crypto.randomUUID(), []);

    const path = element.$file;
    const { start, end } = element.$position;
    const created = element.value("created");

    const workspace = dc.app.workspace;
    if (!workspace) throw new Error("No workspace found");

    // タイムスタンプをクリックした際に埋め込み元のファイルにジャンプするイベントハンドラー
    const onTimestampClick = dc.useCallback(
        (event) => workspace.openLinkText(path, path, event.shiftKey),
        [path, workspace]
    );

    const elementStatus = element.value("status");
    const inputName = `page-status-${uuid}`;
    const [pageStatus, setPageStatus] = dc.useState(() => elementStatus ?? "tweet");
    const file = dc.core.vault.getFileByPath(path);
    if (!file) throw new Error("No Matching TFile");

    // elementのステータスプロパティが外部から修正された場合に状態を更新する
    dc.useEffect(() => {
        setPageStatus(elementStatus ?? "tweet");
    }, [elementStatus]);

    // ラジオボタンを介して状態が変更された際に、実際にファイルのプロパティを更新する
    dc.useEffect(() => {
        if (elementStatus === pageStatus) return;
        dc.app.fileManager.processFrontMatter(file, (frontmatter) => {
            frontmatter.status = pageStatus;
        });
    }, [pageStatus, file, elementStatus]);

    return (
        <div className="personalized-embed" key={uuid}>
            <div className="personalized-embed-header">
                <h2 onClick={onTimestampClick}>{created.toFormat("HH:mm:ss")}</h2>
                <fieldset>
                    {STATUS_OPTIONS.map(({ value, label }) => (
                        <dc.preact.Fragment key={value}>
                            <input
                                type="radio"
                                id={`choice-${value}-${uuid}`}
                                name={inputName}
                                value={value}
                                checked={pageStatus === value}
                                onChange={() => setPageStatus(value)}
                            />
                            <label htmlFor={`choice-${value}-${uuid}`}>{label}</label>
                        </dc.preact.Fragment>
                    ))}
                </fieldset>
            </div>

            <dc.SpanEmbed path={path} start={start} end={end} showExplain={false} />
        </div>
    );
}
