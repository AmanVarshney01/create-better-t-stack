"use client";

import { Play, Terminal } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { Suspense } from "react";
import { Tweet, TweetSkeleton, type TwitterComponents } from "react-tweet";

const YOUTUBE_VIDEOS = [
	{
		id: "VIDEO_001",
		embedId: "CWwkWJmT_zU",
		title: "The BEST Way To Start a Project (Better-T-Stack)",
	},
	{
		id: "VIDEO_002",
		embedId: "MGmPTcgJYIo",
		title: "This new CLI tool makes scaffolding projects easy",
	},
	{
		id: "VIDEO_003",
		embedId: "g-ynSAdL6Ak",
		title: "This tool cured my JavaScript fatigue",
	},
	{
		id: "VIDEO_004",
		embedId: "uHUgw-Hi8HE",
		title: "I tried React again after 2 years of Svelte",
	},
];

const TWEET_IDS = [
	"1930194170418999437",
	"1907728148294447538",
	"1936942642069455037",
	"1931029815047455149",
	"1933149770639614324",
	"1937599252173128103",
	"1947357370302304559",
	"1930511724702285885",
	"1945591420657532994",
	"1945204056063913989",
	"1912836377365905496",
	"1947973299805561005",
	"1949843350250738126",
	"1949907407657992231",
	"1907817662215757853",
	"1933216760896934060",
	"1949912886958301546",
	"1942558041704182158",
	"1947636576118304881",
	"1937383786637094958",
	"1931709370003583004",
	"1929147326955704662",
	"1948050877454938549",
	"1904228496144269699",
	"1949851365435469889",
	"1930257410259616057",
	"1937258706279817570",
	"1917815700980391964",
	"1949921211586400419",
	"1947812547551498466",
	"1928317790588403953",
	"1917640304758514093",
	"1907831059275735353",
	"1912924558522524039",
	"1945054982870282575",
	"1933150129738981383",
	"1949907577611145726",
	"1911490975173607495",
	"1930104047845158972",
	"1913773945523953713",
	"1944937093387706572",
	"1904241046898556970",
	"1913834145471672652",
	"1946245671880966269",
	"1930514202260635807",
	"1931589579749892480",
	"1904144343125860404",
	"1917610656477348229",
	"1904215768272654825",
	"1931830211013718312",
	"1944895251811893680",
	"1913833079342522779",
	"1930449311848087708",
	"1942680754384953790",
	"1907723601731530820",
	"1944553262792810603",
	"1904233896851521980",
	"1930294868808515726",
	"1943290033383047237",
	"1913801258789491021",
	"1907841646513005038",
	"1904301540422070671",
	"1944208789617471503",
	"1912837026925195652",
	"1904338606409531710",
	"1942965795920679188",
	"1904318186750652606",
	"1943656585294643386",
	"1908568583799484519",
	"1913018977321693448",
	"1904179661086556412",
	"1908558365128876311",
	"1907772878139072851",
	"1906149740095705265",
	"1906001923456790710",
	"1906570888897777847",
];

export const components: TwitterComponents = {
	AvatarImg: (props) => <Image {...props} alt={props.alt} unoptimized />,
	MediaImg: (props) => <Image {...props} alt={props.alt} fill unoptimized />,
};

export default function Testimonials() {
	const getResponsiveColumns = (numCols: number) => {
		const columns: string[][] = Array(numCols)
			.fill(null)
			.map(() => []);

		TWEET_IDS.forEach((tweetId, index) => {
			const colIndex = index % numCols;
			columns[colIndex].push(tweetId);
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

	const VideoCard = ({
		video,
		index,
	}: {
		video: (typeof YOUTUBE_VIDEOS)[0];
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
						<span className="font-semibold text-xs">[{video.id}]</span>
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

	const TweetCard = ({
		tweetId,
		index,
	}: {
		tweetId: string;
		index: number;
	}) => (
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
						<Suspense fallback={<TweetSkeleton />}>
							<Tweet id={tweetId} components={components} />
						</Suspense>
					</div>
				</div>
			</div>
		</motion.div>
	);

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
						[{YOUTUBE_VIDEOS.length} ENTRIES]
					</span>
				</div>

				<div className="block sm:hidden">
					<motion.div
						className="flex flex-col gap-4"
						variants={containerVariants}
						initial="hidden"
						animate="visible"
					>
						{YOUTUBE_VIDEOS.map((video, index) => (
							<VideoCard key={video.id} video={video} index={index} />
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
						{YOUTUBE_VIDEOS.map((video, index) => (
							<VideoCard key={video.id} video={video} index={index} />
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
					[{TWEET_IDS.length} ENTRIES]
				</span>
			</div>
			<div className="block sm:hidden">
				<motion.div
					className="flex flex-col gap-4"
					variants={containerVariants}
					initial="hidden"
					animate="visible"
				>
					{TWEET_IDS.map((tweetId, index) => (
						<TweetCard key={tweetId} tweetId={tweetId} index={index} />
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
							key={column.join("-")}
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
							key={column.join("-")}
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
