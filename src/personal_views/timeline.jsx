import { PersonalizedPageEmbed } from "./components/personalized-embed";

function View() {
    const currentFile = dc.useCurrentFile();
    const today = currentFile.$name;
    const data = dc.useQuery(`@page and path("tweets/${today}")`);
    return <dc.List rows={data} type="block" renderer={PersonalizedPageEmbed} />;
}
