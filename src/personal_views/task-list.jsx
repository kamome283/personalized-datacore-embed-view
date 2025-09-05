import { PersonalizedPageEmbed } from "./components/personalized-embed";

export function View() {
    const currentFile = dc.useCurrentFile();
    const today = currentFile.$name;
    const query = `
        @page 
        and created >= date(${today}) - dur(6d) 
        and created < date(${today}) + dur(1d)
        and status != "tweet"`;
    const data = dc.useQuery(query);
    return <dc.List rows={data} type="block" renderer={PersonalizedPageEmbed} />;
}
