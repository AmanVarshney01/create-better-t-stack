"use client";

import { motion } from "motion/react";
import Image from "next/image";

export default function SponsorsSection() {
	const sectionVariants = {
		hidden: { opacity: 0, y: 30 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.6, ease: "easeOut" },
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
					<span className="text-primary">Sponsors</span>
				</h2>
			</div>

			<motion.div
				className="flex justify-center"
				initial={{ opacity: 0, scale: 0.9 }}
				whileInView={{ opacity: 1, scale: 1 }}
				viewport={{ once: true, amount: 0.5 }}
				transition={{ duration: 0.5, delay: 0.2 }}
			>
				<Image
					src="https://cdn.jsdelivr.net/gh/amanvarshney01/sponsors@master/sponsorkit/sponsors.svg"
					alt="Sponsors"
					width={1000}
					height={500}
					className="h-auto max-w-full md:max-w-2xl"
					style={{ colorScheme: "light" }}
				/>
			</motion.div>

			<div className="text-center">
				<a
					href="https://github.com/sponsors/AmanVarshney01"
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-2 rounded-md border border-primary/50 bg-primary/10 px-4 py-2 font-mono text-primary text-sm transition-colors hover:bg-primary/20"
				>
					Become a Sponsor
				</a>
			</div>
		</motion.section>
	);
}
