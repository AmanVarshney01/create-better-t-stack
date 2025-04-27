"use client";
import ShinyText from "@/app/(home)/_components/ShinyText";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import React from "react";
import CodeContainer from "./_components/CodeContainer";
import CustomizableSection from "./_components/CustomizableSection";
import Footer from "./_components/Footer";
import Navbar from "./_components/Navbar";
import NpmPackage from "./_components/NpmPackage";
import SponsorsSection from "./_components/SponsorsSection";
import Testimonials from "./_components/Testimonials";

export default function HomePage() {
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.15,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
				ease: "easeOut",
			},
		},
	};

	const sectionVariants = {
		hidden: { opacity: 0, y: 30 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: "easeOut",
			},
		},
	};

	return (
		<>
			<Navbar />
			<main className="flex min-h-screen flex-col items-center justify-start overflow-x-hidden bg-background px-0 pt-24 pb-10 sm:px-4 sm:pb-16 md:px-8 md:pt-28 lg:pt-32">
				<motion.div
					className="relative z-10 mx-auto mb-16 max-w-5xl text-center sm:mb-20"
					initial="hidden"
					animate="visible"
					variants={containerVariants}
				>
					<div className="px-1 sm:px-6 lg:px-8">
						<div className="flex flex-col items-center justify-center space-y-4 text-center sm:space-y-5">
							<motion.h1
								className="font-bold font-mono text-4xl xs:text-5xl tracking-tight sm:text-6xl md:text-7xl"
								variants={itemVariants}
							>
								<span className="border-primary border-b-2 pb-1 text-foreground dark:text-primary">
									Better-T Stack
								</span>
							</motion.h1>

							<motion.div className="mb-1 sm:mb-2" variants={itemVariants}>
								<NpmPackage />
							</motion.div>

							<motion.p
								className="max-w-2xl px-1 font-mono text-lg text-muted-foreground sm:text-xl"
								variants={itemVariants}
							>
								A modern CLI tool for scaffolding end-to-end type-safe
								TypeScript projects with best practices and customizable
								configurations
							</motion.p>

							<motion.div
								className="mx-auto mt-2 w-full max-w-3xl sm:mt-3"
								variants={itemVariants}
							>
								<CodeContainer />
							</motion.div>

							<motion.div variants={itemVariants}>
								<ShinyText
									text="Type-safe. Modern. Minimal. Fast."
									speed={3}
									className="font-mono text-muted-foreground text-xs xs:text-sm sm:text-base"
								/>
							</motion.div>
						</div>
					</div>
				</motion.div>

				<motion.div
					className="w-full"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.2 }}
					variants={sectionVariants}
				>
					<CustomizableSection />
				</motion.div>

				<motion.div
					className="relative w-full pt-10 sm:pt-16"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.5 }}
					variants={sectionVariants}
				>
					<div className="relative mx-auto max-w-5xl">
						<div className="flex items-center justify-center">
							<div className="hidden w-1/3 items-center sm:flex">
								<div className="h-px flex-grow bg-gradient-to-r from-transparent via-primary/30 to-primary/50" />
								<div className="h-2 w-2 rounded-full bg-primary/60" />
							</div>
							<div className="px-4 sm:px-6">
								<div
									className={cn(
										"flex h-8 w-8 items-center justify-center rounded-full border border-primary/80 bg-card sm:h-9 sm:w-9",
									)}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4 text-primary sm:h-5 sm:w-5"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<title>Code Icon</title>
										<path
											fillRule="evenodd"
											d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
							</div>
							<div className="hidden w-1/3 items-center sm:flex">
								<div className="h-2 w-2 rounded-full bg-primary/60" />
								<div className="h-px flex-grow bg-gradient-to-l from-transparent via-primary/30 to-primary/50" />
							</div>
						</div>
						<div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent sm:hidden" />
					</div>
				</motion.div>

				<motion.div
					className="w-full"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.15 }}
					variants={sectionVariants}
				>
					<Testimonials />
				</motion.div>

				<motion.div
					className="w-full"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.15 }}
					variants={sectionVariants}
				>
					<SponsorsSection />
				</motion.div>
			</main>
			<Footer />
		</>
	);
}
