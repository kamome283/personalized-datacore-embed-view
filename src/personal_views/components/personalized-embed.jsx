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
        return <div />;
    }

    // コンポーネントの初回作成時に一意で更新されないUUIDを付与
    // キーなど一意性が必要な場所で用いる
    const uuid = dc.useMemo(() => self.crypto.randomUUID(), []);

    const path = element.$file;
    const { start, end } = element.$position;
    const created = element.value("created");

    const workspace = dc.app.workspace;
    if (!workspace) throw new Error("No workspace found");

    // クリックした際に埋め込み元のファイルにジャンプするイベントハンドラー
    const jumpToFile = dc.useCallback(
        (event) => {
            // イベントの発生源がチェックボックスなら、ファイルへのジャンプを中止する
            if (event.target.closest('a, button, input, select, textarea')) {
                return;
            }
            workspace.openLinkText(path, path, event.shiftKey);
        },
        [path, workspace]
    );

    const status = element.value("status");
    const inputName = `page-status-${uuid}`;
    const onStatusChangeByButton = dc.useCallback(
        (newStatus) => {
            // 実際にボタンを選択した際に処理が走るのやからEffectと違って自動的に処理が走るわけではない
            // 状態を独自に持ち書き込み前に検査することでinvalidな状態に陥るリスクよりも
            // 毎回必ず書き込みを行うことでコストはかかるが確実にvalidな状態になるほうが好ましい
            // また書き込み処理の回数が多くないのならこのコールバックの外でファイルを作成し
            // そのファイルを依存配列に入れるよりも毎回ここで作成するほうが信頼性が高そう
            const file = dc.core.vault.getFileByPath(path);
            if (!file) throw new Error("No Matching TFile");
            dc.app.fileManager.processFrontMatter(file, (frontmatter) => {
                frontmatter.status = newStatus;
            });
        },
        [path]
    );

    return (
        <div className="personalized-embed" key={uuid}>
            <div className="personalized-embed-header">
                <h3 onClick={jumpToFile}>
                    <span className="embed-header-date">{created.toFormat("MM/dd")}</span>
                    <span className="embed-header-space"> </span>
                    <span className="embed-header-time">{created.toFormat("HH:mm:ss")}</span>
                </h3>
                <fieldset>
                    {STATUS_OPTIONS.map(({ value, label }) => (
                        <dc.preact.Fragment key={value}>
                            <input
                                type="radio"
                                id={`choice-${value}-${uuid}`}
                                name={inputName}
                                value={value}
                                checked={status === value}
                                onChange={() => onStatusChangeByButton(value)}
                            />
                            <label htmlFor={`choice-${value}-${uuid}`}>{label}</label>
                        </dc.preact.Fragment>
                    ))}
                </fieldset>
            </div>

            <div onClick={jumpToFile}>
                <dc.SpanEmbed path={path} start={start} end={end} showExplain={false} />
            </div>
        </div>
    );
}
