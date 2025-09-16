import { PersonalizedPageEmbed } from "./components/personalized-embed";
import { STATUS_OPTIONS } from "./constants/status-options";

const HIDE_DONE_SECTION = true;

const taskGroupHeadingStyles = {
    "--font-weight": "var(--h3-weight)",
    fontVariant: "var(--h3-variant)",
    letterSpacing: "-0.015em",
    lineHeight: "var(--h3-line-height)",
    fontSize: "var(--h3-size)",
    color: "var(--h3-color)",
    fontWeight: "var(--font-weight)",
    fontStyle: "var(--h3-style)",
    fontFamily: "var(--h3-font)",
};

export function TaskList({ date }) {
    const query = `
        @page 
        and created >= date(${date}) - dur(6d) 
        and created < date(${date}) + dur(1d)
        and exists(status)
        and status != "tweet"`;
    const data = dc.useQuery(query);
    const grouped = dc.useArray(data, (data) => {
        return data.sort((e) => e.value("created")).groupBy((e) => e.value("status"));
    });

    // HIDE_DONE_SECTION が true ならば定数の最後のDONEも取り除き、 falseならば取り除かない
    const taskOptions = STATUS_OPTIONS.slice(1, HIDE_DONE_SECTION ? -1 : undefined);
    return taskOptions.map((option) => {
        const group = grouped.find(({ key, _ }) => key === option.value);
        if (!group) return <div />;

        const { key, rows } = group;
        return (
            <div key={key}>
                <h2 style={taskGroupHeadingStyles}>
                    {key.toUpperCase()}
                    {option.label}
                </h2>
                <dc.List rows={rows} type="block" renderer={PersonalizedPageEmbed} />
            </div>
        );
    });
}
