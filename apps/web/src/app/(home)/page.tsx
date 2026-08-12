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

  // Keyed by pane id, not array position: PANES lives in another file and
  // reordering one list must not silently pair a title with the wrong body.
  const content = new Map<string, { body: ReactNode; count?: number; footer?: ReactNode }>([
    ["pane-init", { body: <InitPane /> }],
    [
      "pane-sponsors",
      {
        body: <SponsorsPane sponsorsData={sponsorsData} />,
        footer: <SponsorsPaneFooter />,
      },
    ],
    ["pane-videos", { body: <VideosPane videos={videos} />, count: videos.length }],
    [
      "pane-tweets",
      {
        body: <TweetsPane tweets={tweets} />,
        count: tweets.length,
        footer: <ColophonFooter />,
      },
    ],
  ]);

  return (
    <Rail>
      {PANES.map((pane, index) => {
        const paneContent = content.get(pane.id);
        return (
          <Pane
            key={pane.id}
            id={pane.id}
            index={index}
            title={pane.title}
            width={pane.width}
            count={paneContent?.count}
            footer={paneContent?.footer}
          >
            {paneContent?.body}
          </Pane>
        );
      })}
    </Rail>
  );
}
