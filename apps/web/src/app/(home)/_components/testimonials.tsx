"use client";

import type { api } from "@better-t-stack/backend/convex/_generated/api";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import { Play, Terminal } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { Tweet, type TwitterComponents } from "react-tweet";

export const components: TwitterComponents = {
	AvatarImg: (props) => {
		if (!props.src || props.src === "") {
			return (
				<div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted" />
			);
		}
		return <Image {...props} alt={props.alt || "User avatar"} unoptimized />;
	},
	MediaImg: (props) => {
		if (!props.src || props.src === "") {
			return (
				<div className="flex h-32 w-full items-center justify-center rounded bg-muted" />
			);
		}
		return (
			<Image {...props} alt={props.alt || "Media content"} fill unoptimized />
		);
	},
};

const VideoCard = ({
	video,
	index,
}: {
	video: { embedId: string; title: string };
	index: number;
}) => (
	<motion.div
		className="w-full min-w-0"
		initial={{ opacity: 0, y: 20, scale: 0.95 }}
		animate={{ opacity: 1, y: 0, scale: 1 }}
		transition={{
			delay: index * 0.1,
			duration: 0.4,
			ease: "easeOut",
		}}
	>
		<div className="w-full min-w-0 overflow-hidden rounded border border-border">
			<div className="sticky top-0 z-10 border-border border-b px-2 py-2">
				<div className="flex items-center gap-2">
					<Play className="h-3 w-3 text-primary" />
					<span className="font-semibold text-xs">
						[VIDEO_{String(index + 1).padStart(3, "0")}]
					</span>
				</div>
			</div>
			<div className="w-full min-w-0 overflow-hidden">
				<div className="relative aspect-video w-full">
					<iframe
						src={`https://www.youtube.com/embed/${video.embedId}`}
						title={video.title}
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
						className="absolute inset-0 h-full w-full"
					/>
				</div>
			</div>
		</div>
	</motion.div>
);

const TweetCard = ({ tweetId, index }: { tweetId: string; index: number }) => (
	<motion.div
		className="w-full min-w-0"
		initial={{ opacity: 0, y: 20, scale: 0.95 }}
		animate={{ opacity: 1, y: 0, scale: 1 }}
		transition={{
			delay: index * 0.05,
			duration: 0.4,
			ease: "easeOut",
		}}
	>
		<div className="w-full min-w-0 overflow-hidden rounded border border-border">
			<div className="sticky top-0 z-10 border-border border-b px-3 py-2">
				<div className="flex items-center gap-2">
					<span className="text-primary text-xs">▶</span>
					<span className="font-semibold text-xs">
						[TWEET_{String(index + 1).padStart(3, "0")}]
					</span>
				</div>
			</div>
			<div className="w-full min-w-0 overflow-hidden">
				<div style={{ width: "100%", minWidth: 0, maxWidth: "100%" }}>
					{/* <Suspense fallback={<TweetSkeleton />}> */}
					<Tweet id={tweetId} components={components} />
					{/* </Suspense> */}
				</div>
			</div>
		</div>
	</motion.div>
);

export default function Testimonials({
	preloadedTestimonialsTweet,
	preloadedTestimonialsVideos,
}: {
	preloadedTestimonialsTweet: Preloaded<typeof api.testimonials.getTweets>;
	preloadedTestimonialsVideos: Preloaded<typeof api.testimonials.getVideos>;
}) {
	const videosData = usePreloadedQuery(preloadedTestimonialsVideos);
	const tweetsData = usePreloadedQuery(preloadedTestimonialsTweet);

	const videos = videosData || [];
	const tweets = tweetsData || [];

	const getResponsiveColumns = (numCols: number) => {
		const columns: string[][] = Array(numCols)
			.fill(null)
			.map(() => []);

		tweets.forEach((tweet, index) => {
			const colIndex = index % numCols;
			columns[colIndex].push(tweet.tweetId);
		});

		return columns;
	};

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: 0.1, delayChildren: 0.1 },
		},
	};

	const columnVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: 0.05 },
		},
	};

	return (
		<div className="mb-12 w-full max-w-full overflow-hidden px-4">
			<div className="mb-8">
				<div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
					<div className="flex items-center gap-2">
						<Play className="h-5 w-5 text-primary" />
						<span className="font-bold text-lg sm:text-xl">
							VIDEO_TESTIMONIALS.LOG
						</span>
					</div>
					<div className="hidden h-px flex-1 bg-border sm:block" />
					<span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
						[{videos.length} ENTRIES]
					</span>
				</div>

				<div className="block sm:hidden">
					<motion.div
						className="flex flex-col gap-4"
						variants={containerVariants}
						initial="hidden"
						animate="visible"
					>
						{videos.map((video, index) => (
							<VideoCard
								key={`video-${video.embedId}`}
								video={video}
								index={index}
							/>
						))}
					</motion.div>
				</div>

				<div className="hidden sm:block">
					<motion.div
						className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
						variants={containerVariants}
						initial="hidden"
						animate="visible"
					>
						{videos.map((video, index) => (
							<VideoCard
								key={`video-${video.embedId}`}
								video={video}
								index={index}
							/>
						))}
					</motion.div>
				</div>
			</div>

			<div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
				<div className="flex items-center gap-2">
					<Terminal className="h-5 w-5 text-primary" />
					<span className="font-bold text-lg sm:text-xl">
						DEVELOPER_TESTIMONIALS.LOG
					</span>
				</div>
				<div className="hidden h-px flex-1 bg-border sm:block" />
				<span className="w-full text-right text-muted-foreground text-xs sm:w-auto sm:text-left">
					[{tweets.length} ENTRIES]
				</span>
			</div>
			<div className="block sm:hidden">
				<motion.div
					className="flex flex-col gap-4"
					variants={containerVariants}
					initial="hidden"
					animate="visible"
				>
					{tweets.map((tweet, index) => (
						<TweetCard
							key={tweet.tweetId}
							tweetId={tweet.tweetId}
							index={index}
						/>
					))}
				</motion.div>
			</div>

			<div className="hidden sm:block lg:hidden">
				<motion.div
					className="grid grid-cols-2 gap-4"
					variants={containerVariants}
					initial="hidden"
					animate="visible"
				>
					{getResponsiveColumns(2).map((column, colIndex) => (
						<motion.div
							key={`col-2-${column.length > 0 ? column[0] : `empty-${colIndex}`}`}
							className="flex min-w-0 flex-col gap-4"
							variants={columnVariants}
						>
							{column.map((tweetId, tweetIndex) => {
								const globalIndex = colIndex + tweetIndex * 2;
								return (
									<TweetCard
										key={tweetId}
										tweetId={tweetId}
										index={globalIndex}
									/>
								);
							})}
						</motion.div>
					))}
				</motion.div>
			</div>

			<div className="hidden lg:block">
				<motion.div
					className="grid grid-cols-3 gap-4"
					variants={containerVariants}
					initial="hidden"
					animate="visible"
				>
					{getResponsiveColumns(3).map((column, colIndex) => (
						<motion.div
							key={`col-3-${column.length > 0 ? column[0] : `empty-${colIndex}`}`}
							className="flex min-w-0 flex-col gap-4"
							variants={columnVariants}
						>
							{column.map((tweetId, tweetIndex) => {
								const globalIndex = colIndex + tweetIndex * 3;
								return (
									<TweetCard
										key={tweetId}
										tweetId={tweetId}
										index={globalIndex}
									/>
								);
							})}
						</motion.div>
					))}
				</motion.div>
			</div>
		</div>
	);
}
