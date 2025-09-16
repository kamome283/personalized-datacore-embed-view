import { PersonalizedPageEmbed } from "./components/personalized-embed";

export function Timeline() {
    const currentFile = dc.useCurrentFile();
    const today = currentFile.$name;
    const data = dc.useQuery(`@page and path("tweets/${today}")`);
    const sorted = dc.useArray(data, (data) => data.sort((e) => e.value("created")));
    return <dc.List rows={sorted} type="block" renderer={PersonalizedPageEmbed} />;
}
