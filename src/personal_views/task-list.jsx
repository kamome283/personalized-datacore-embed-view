import { PersonalizedPageEmbed } from "./components/personalized-embed";
import { STATUS_OPTIONS } from "./constants/status-options";

function View() {
    const currentFile = dc.useCurrentFile();
    const today = currentFile.$name;
    const query = `
        @page 
        and created >= date(${today}) - dur(6d) 
        and created < date(${today}) + dur(1d)
        and exists(status)
        and status != "tweet"`;
    const data = dc.useQuery(query);
    const grouped = dc.useArray(data, (data) => {
        return data.sort((e) => e.value("created")).groupBy((e) => e.value("status"));
    });

    const taskOptions = STATUS_OPTIONS.slice(1);
    return taskOptions.map((option) => {
        const group = grouped.find(({ key, _ }) => key === option.value);
        if (!group) return <div />;

        const { key, rows } = group;
        return (
            <div key={key}>
                <h2>
                    {key.toUpperCase()}
                    {option.label}
                </h2>
                <dc.List rows={rows} type="block" renderer={PersonalizedPageEmbed} />
            </div>
        );
    });
}
