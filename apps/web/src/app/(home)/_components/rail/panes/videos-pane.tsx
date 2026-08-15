"use client";

import { Deferred, VideoCard } from "./media";

export default function VideosPane({
  videos,
}: {
  videos: Array<{ embedId: string; title: string }>;
}) {
  const ordered = [...videos].reverse();

  // Container query rather than lg:grid-cols-2: the pane has a width of its own,
  // so the column count has to follow the pane body, not the viewport.
  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-5 @2xl:grid-cols-2">
        {ordered.map((video, index) => (
          <Deferred key={video.embedId}>
            <VideoCard video={video} index={index} />
          </Deferred>
        ))}
      </div>
    </div>
  );
}
