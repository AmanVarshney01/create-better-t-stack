"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { Tweet } from "react-tweet";

const TWEET_IDS = [
	"1907728148294447538",
	"1907831059275735353",
	"1912836377365905496",
	"1907817662215757853",
	"1904228496144269699",
	"1912924558522524039",
	"1911490975173607495",
	"1913773945523953713",
	"1904241046898556970",
	"1913834145471672652",
	"1904144343125860404",
	"1904215768272654825",
	"1913833079342522779",
	"1907723601731530820",
	"1904233896851521980",
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

const MAX_VISIBLE_PAGES = 5;

export default function Testimonials() {
	const [startIndex, setStartIndex] = useState(0);
	const [tweetsPerPage] = useState(6); // Show 6 tweets per page

	const totalPages = useMemo(
		() => Math.ceil(TWEET_IDS.length / tweetsPerPage),
		[tweetsPerPage],
	);
	const currentPage = useMemo(
		() => Math.floor(startIndex / tweetsPerPage) + 1,
		[startIndex, tweetsPerPage],
	);

	const handleNext = () => {
		setStartIndex((prev) =>
			Math.min(prev + tweetsPerPage, (totalPages - 1) * tweetsPerPage),
		);
	};

	const handlePrev = () => {
		setStartIndex((prev) => Math.max(0, prev - tweetsPerPage));
	};

	const goToPage = (pageNumber: number) => {
		setStartIndex((pageNumber - 1) * tweetsPerPage);
	};

	const visibleTweetIndices = useMemo(() => {
		const end = Math.min(startIndex + tweetsPerPage, TWEET_IDS.length);
		return Array.from({ length: end - startIndex }, (_, i) => startIndex + i);
	}, [startIndex, tweetsPerPage]);

	const paginationDots = useMemo(() => {
		if (totalPages <= MAX_VISIBLE_PAGES) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}

		const startPage = Math.max(
			1,
			Math.min(
				currentPage - Math.floor(MAX_VISIBLE_PAGES / 2),
				totalPages - MAX_VISIBLE_PAGES + 1,
			),
		);
		const endPage = Math.min(totalPages, startPage + MAX_VISIBLE_PAGES - 1);

		const pages: (number | string)[] = [];
		if (startPage > 1) {
			pages.push(1);
			if (startPage > 2) pages.push("...");
		}
		for (let i = startPage; i <= endPage; i++) {
			pages.push(i);
		}
		if (endPage < totalPages) {
			if (endPage < totalPages - 1) pages.push("...");
			pages.push(totalPages);
		}
		return pages;
	}, [totalPages, currentPage]);

	const sectionVariants = {
		hidden: { opacity: 0, y: 30 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.6, ease: "easeOut" },
		},
	};

	const gridVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: 0.1, delayChildren: 0.2 },
		},
	};

	return (
		<motion.section
			className="relative z-10 mx-auto w-full max-w-7xl space-y-12 px-4 py-16 sm:px-6 sm:py-24 lg:space-y-16 lg:px-8"
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, amount: 0.2 }}
			variants={sectionVariants}
		>
			<div className="text-center">
				<h2 className="font-bold font-mono text-3xl text-foreground tracking-tight sm:text-4xl lg:text-5xl">
					Loved by <span className="text-primary">Developers</span>
				</h2>
				<p className="mx-auto mt-4 max-w-2xl font-mono text-lg text-muted-foreground leading-relaxed">
					See what people are saying about Better-T-Stack on X.
				</p>
			</div>

			<motion.div
				className={cn("grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3")}
				variants={gridVariants}
			>
				{visibleTweetIndices.map((index) => (
					<div
						key={TWEET_IDS[index]}
						className="overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-md"
					>
						<Tweet id={TWEET_IDS[index]} />
					</div>
				))}
			</motion.div>

			{totalPages > 1 && (
				<motion.div
					className="mt-10 flex items-center justify-between sm:mt-12"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5, duration: 0.5 }}
				>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={handlePrev}
						disabled={currentPage === 1}
						className={cn(
							"inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 font-medium text-muted-foreground text-sm transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50",
						)}
						aria-label="Previous page"
					>
						<ChevronLeft className="size-4" />
						Prev
					</motion.button>

					<div className="hidden items-center gap-1 sm:flex">
						{paginationDots.map((page, index) =>
							typeof page === "number" ? (
								<button
									type="button"
									key={`${page}-${
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										index
									}`}
									onClick={() => goToPage(page)}
									className={cn(
										"flex h-8 w-8 items-center justify-center rounded-md font-medium text-sm transition-colors",
										currentPage === page
											? "bg-primary/10 text-primary"
											: "text-muted-foreground hover:bg-muted",
									)}
									aria-label={`Go to page ${page}`}
									aria-current={currentPage === page ? "page" : undefined}
								>
									{page}
								</button>
							) : (
								<span
									key={`ellipsis-${
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										index
									}`}
									className="flex h-8 w-8 items-center justify-center text-muted-foreground text-sm"
									aria-hidden="true"
								>
									...
								</span>
							),
						)}
					</div>
					<div className="text-muted-foreground text-sm sm:hidden">
						Page {currentPage} of {totalPages}
					</div>

					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={handleNext}
						disabled={currentPage === totalPages}
						className={cn(
							"inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 font-medium text-muted-foreground text-sm transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50",
						)}
						aria-label="Next page"
					>
						Next
						<ChevronRight className="size-4" />
					</motion.button>
				</motion.div>
			)}
		</motion.section>
	);
}
