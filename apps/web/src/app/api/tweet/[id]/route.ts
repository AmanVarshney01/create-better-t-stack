import { NextResponse } from "next/server";
import { fetchTweet, TwitterApiError, type Tweet } from "react-tweet/api";

export const revalidate = 86_400;

type TweetEntityArrays = {
  hashtags?: unknown[];
  media?: unknown[];
  symbols?: unknown[];
  urls?: unknown[];
  user_mentions?: unknown[];
};

type TweetWithEntities = {
  entities?: TweetEntityArrays;
  parent?: TweetWithEntities;
  quoted_tweet?: TweetWithEntities;
};

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;

  try {
    const { data, notFound, tombstone } = await fetchTweet(id);

    if (notFound || tombstone || !data) {
      return NextResponse.json({ data: null }, { status: 404 });
    }

    return NextResponse.json({ data: normalizeTweet(data) });
  } catch (error) {
    if (error instanceof TwitterApiError) {
      return NextResponse.json(
        {
          data: null,
          error: error.message,
        },
        { status: error.status },
      );
    }

    console.error("Tweet fetch error:", error);
    return NextResponse.json({ data: null, error: "Failed to fetch tweet" }, { status: 500 });
  }
}

function normalizeTweet<T extends TweetWithEntities>(tweet: T): T {
  return {
    ...tweet,
    entities: normalizeEntities(tweet.entities),
    parent: tweet.parent ? normalizeTweet(tweet.parent) : tweet.parent,
    quoted_tweet: tweet.quoted_tweet ? normalizeTweet(tweet.quoted_tweet) : tweet.quoted_tweet,
  };
}

function normalizeEntities(entities?: TweetEntityArrays): Tweet["entities"] {
  const media = normalizeEntityArray(entities?.media);

  return {
    ...entities,
    hashtags: normalizeEntityArray(entities?.hashtags),
    media: media.length > 0 ? media : undefined,
    symbols: normalizeEntityArray(entities?.symbols),
    urls: normalizeEntityArray(entities?.urls),
    user_mentions: normalizeEntityArray(entities?.user_mentions),
  } as Tweet["entities"];
}

function normalizeEntityArray(entities?: unknown[]) {
  if (!Array.isArray(entities)) return [];

  return entities.filter((entity) => {
    if (!entity || typeof entity !== "object" || !("indices" in entity)) return false;

    const indices = entity.indices;
    return (
      Array.isArray(indices) &&
      indices.length === 2 &&
      typeof indices[0] === "number" &&
      typeof indices[1] === "number"
    );
  });
}
