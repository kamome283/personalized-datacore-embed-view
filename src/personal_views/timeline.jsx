import { PersonalizedPageEmbed } from "./components/personalized-embed";

export function Timeline(date) {
    const data = dc.useQuery(`@page and path("tweets/${date}")`);
    const sorted = dc.useArray(data, (data) => data.sort((e) => e.value("created")));
    return <dc.List rows={sorted} type="block" renderer={PersonalizedPageEmbed} />;
}
