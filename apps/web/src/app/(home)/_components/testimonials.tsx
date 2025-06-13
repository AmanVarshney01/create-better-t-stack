"use client";

import { Terminal } from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import { Tweet } from "react-tweet";

const TWEET_IDS = [
	"1930194170418999437",
	"1907728148294447538",
	"1931029815047455149",
	"1930511724702285885",
	"1933149770639614324",
	"1912836377365905496",
	"1907817662215757853",
	"1933216760896934060",
	"1931709370003583004",
	"1929147326955704662",
	"1904228496144269699",
	"1930257410259616057",
	"1917815700980391964",
	"1928317790588403953",
	"1917640304758514093",
	"1907831059275735353",
	"1912924558522524039",
	"1933150129738981383",
	"1911490975173607495",
	"1930104047845158972",
	"1913773945523953713",
	"1904241046898556970",
	"1913834145471672652",
	"1930514202260635807",
	"1931589579749892480",
	"1904144343125860404",
	"1917610656477348229",
	"1904215768272654825",
	"1931830211013718312",
	"1913833079342522779",
	"1930449311848087708",
	"1907723601731530820",
	"1904233896851521980",
	"1930294868808515726",
	"1913801258789491021",
	"1907841646513005038",
	"1904301540422070671",
	"1912837026925195652",
	"1904338606409531710",
	"1904318186750652606",
	"1908568583799484519",
	"1913018977321693448",
	"1904179661086556412",
	"1908558365128876311",
	"1907772878139072851",
	"1906149740095705265",
	"1906001923456790710",
	"1906570888897777847",
];

export default function Testimonials() {
	// Split tweets into 3 columns
	const columns = useMemo(() => {
		const col1: string[] = [];
		const col2: string[] = [];
		const col3: string[] = [];

		TWEET_IDS.forEach((tweetId, index) => {
			if (index % 3 === 0) col1.push(tweetId);
			else if (index % 3 === 1) col2.push(tweetId);
			else col3.push(tweetId);
		});

		return [col1, col2, col3];
	}, []);

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
		<div className="mb-12">
			<div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
				<div className="flex items-center gap-2">
					<Terminal className="h-5 w-5 text-primary" />
					<span className="font-bold font-mono text-lg sm:text-xl">
						DEVELOPER_TESTIMONIALS.LOG
					</span>
				</div>
				<div className="hidden h-px flex-1 bg-border sm:block" />
				<span className="w-full text-right font-mono text-muted-foreground text-xs sm:w-auto sm:text-left">
					[{TWEET_IDS.length} ENTRIES]
				</span>
			</div>

			<div className="terminal-block-hover mb-8 rounded border border-border bg-muted/20 p-4">
				<div className="flex items-center gap-2 text-sm">
					<span className="text-primary">$</span>
					<span className="font-mono text-foreground">
						# Community feedback from X (Twitter)
					</span>
				</div>
				<div className="mt-2 flex items-center gap-2 text-sm">
					<span className="text-primary">$</span>
					<span className="font-mono text-muted-foreground">
						# Real developers sharing their experience
					</span>
				</div>
			</div>

			<motion.div
				className="flex flex-col gap-4 sm:flex-row"
				variants={containerVariants}
				initial="hidden"
				animate="visible"
			>
				<motion.div
					className="flex flex-1 flex-col gap-4"
					variants={columnVariants}
				>
					{columns[0]?.map((tweetId, tweetIndex) => {
						const globalIndex = 0 + tweetIndex * 3;
						return (
							<motion.div
								key={tweetId}
								className="terminal-block-hover overflow-hidden rounded border border-border bg-background"
								initial={{ opacity: 0, y: 20, scale: 0.95 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								transition={{
									delay: tweetIndex * 0.05,
									duration: 0.4,
									ease: "easeOut",
								}}
							>
								<div className="sticky top-0 z-10 border-border border-b bg-muted/20 px-3 py-2">
									<div className="flex items-center gap-2">
										<span className="text-primary text-xs">▶</span>
										<span className="font-mono font-semibold text-xs">
											[TWEET_{String(globalIndex + 1).padStart(3, "0")}]
										</span>
									</div>
								</div>
								<div className="p-0">
									<Tweet id={tweetId} />
								</div>
							</motion.div>
						);
					})}
				</motion.div>

				<motion.div
					className="flex flex-1 flex-col gap-4"
					variants={columnVariants}
				>
					{columns[1]?.map((tweetId, tweetIndex) => {
						const globalIndex = 1 + tweetIndex * 3;
						return (
							<motion.div
								key={tweetId}
								className="terminal-block-hover overflow-hidden rounded border border-border bg-background"
								initial={{ opacity: 0, y: 20, scale: 0.95 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								transition={{
									delay: tweetIndex * 0.05,
									duration: 0.4,
									ease: "easeOut",
								}}
							>
								<div className="sticky top-0 z-10 border-border border-b bg-muted/20 px-3 py-2">
									<div className="flex items-center gap-2">
										<span className="text-primary text-xs">▶</span>
										<span className="font-mono font-semibold text-xs">
											[TWEET_{String(globalIndex + 1).padStart(3, "0")}]
										</span>
									</div>
								</div>
								<div className="p-0">
									<Tweet id={tweetId} />
								</div>
							</motion.div>
						);
					})}
				</motion.div>

				<motion.div
					className="flex flex-1 flex-col gap-4"
					variants={columnVariants}
				>
					{columns[2]?.map((tweetId, tweetIndex) => {
						const globalIndex = 2 + tweetIndex * 3;
						return (
							<motion.div
								key={tweetId}
								className="terminal-block-hover overflow-hidden rounded border border-border bg-background"
								initial={{ opacity: 0, y: 20, scale: 0.95 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								transition={{
									delay: tweetIndex * 0.05,
									duration: 0.4,
									ease: "easeOut",
								}}
							>
								<div className="sticky top-0 z-10 border-border border-b bg-muted/20 px-3 py-2">
									<div className="flex items-center gap-2">
										<span className="text-primary text-xs">▶</span>
										<span className="font-mono font-semibold text-xs">
											[TWEET_{String(globalIndex + 1).padStart(3, "0")}]
										</span>
									</div>
								</div>
								<div className="p-0">
									<Tweet id={tweetId} />
								</div>
							</motion.div>
						);
					})}
				</motion.div>
			</motion.div>
		</div>
	);
}
