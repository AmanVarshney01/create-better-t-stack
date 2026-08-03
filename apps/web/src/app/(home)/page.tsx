export const dynamic = "force-static";

import { api } from "@better-t-stack/backend/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import type { ReactNode } from "react";

import { fetchSponsors } from "@/lib/sponsors";

import Pane from "./_components/rail/pane";
import { PANES } from "./_components/rail/panes-config";
import { ColophonFooter } from "./_components/rail/panes/colophon-footer";
import InitPane from "./_components/rail/panes/init-pane";
import SponsorsPane, { SponsorsPaneFooter } from "./_components/rail/panes/sponsors-pane";
import TweetsPane from "./_components/rail/panes/tweets-pane";
import VideosPane from "./_components/rail/panes/videos-pane";
import Rail from "./_components/rail/rail";

export default async function HomePage() {
  const sponsorsData = await fetchSponsors();
  const fetchedTweets = await fetchQuery(api.testimonials.getTweets);
  const fetchedVideos = await fetchQuery(api.testimonials.getVideos);
  const videos = fetchedVideos.map((v) => ({ embedId: v.embedId, title: v.title }));
  const tweets = fetchedTweets.map((t) => ({ tweetId: t.tweetId }));

  const content: Array<{ body: ReactNode; count?: number; footer?: ReactNode }> = [
    { body: <InitPane /> },
    { body: <SponsorsPane sponsorsData={sponsorsData} />, footer: <SponsorsPaneFooter /> },
    { body: <VideosPane videos={videos} />, count: videos.length },
    { body: <TweetsPane tweets={tweets} />, count: tweets.length, footer: <ColophonFooter /> },
  ];

  return (
    <Rail>
      {PANES.map((pane, index) => (
        <Pane
          key={pane.id}
          id={pane.id}
          index={index}
          title={pane.title}
          width={pane.width}
          count={content[index].count}
          footer={content[index].footer}
        >
          {content[index].body}
        </Pane>
      ))}
    </Rail>
  );
}
