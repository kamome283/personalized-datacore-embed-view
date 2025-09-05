import { PersonalizedPageEmbed } from "./personalized-embed";

export function View() {
    const currentFile = dc.useCurrentFile();
    const today = currentFile.$name;
    const data = dc.useQuery(`@page and path("tweets/${today}")`);
    return <dc.List rows={data} type="block" renderer={PersonalizedPageEmbed} />;
}
