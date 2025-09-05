import { PersonalizedPageEmbed } from "./components/personalized-embed";

export function View() {
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

    return grouped.map(({ key, rows }) => {
        return (
            <div>
                <h2>{key}</h2>
                <dc.List rows={rows} type="block" renderer={PersonalizedPageEmbed} />
            </div>
        );
    });
}
