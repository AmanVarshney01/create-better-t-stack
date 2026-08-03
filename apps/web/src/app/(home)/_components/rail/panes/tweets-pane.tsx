"use client";

import { Tweet } from "react-tweet";

import { components, Deferred, ItemLabel } from "./media";

const EAGER_TWEETS = 6;

export default function TweetsPane({ tweets }: { tweets: Array<{ tweetId: string }> }) {
  return (
    <div className="flex flex-col gap-5">
      {tweets.map((tweet, index) => {
        const card = (
          <div>
            <ItemLabel label={`tweet ${String(index + 1).padStart(3, "0")}`} />
            <Tweet
              id={tweet.tweetId}
              apiUrl={`/api/tweet/${tweet.tweetId}`}
              components={components}
            />
          </div>
        );
        return index < EAGER_TWEETS ? (
          <div key={tweet.tweetId}>{card}</div>
        ) : (
          <Deferred key={tweet.tweetId}>{card}</Deferred>
        );
      })}
    </div>
  );
}
