import { motion } from "motion/react";
import StackArchitect from "./StackArchitech";

export default function CustomizableSection() {
	return (
		<section className="relative z-10 mx-auto mt-20 w-full max-w-7xl space-y-16 px-4 sm:px-6">
			<div className="relative space-y-8 text-center">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={{ duration: 0.5 }}
					className="relative"
				>
					<h2 className="font-bold font-mono text-2xl tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
						<span className="border-primary border-b-2 pb-1 text-foreground dark:text-primary">
							Roll Your Own Stack
						</span>
					</h2>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 15 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="mx-auto max-w-3xl space-y-6"
				>
					<p className="font-mono text-lg text-muted-foreground leading-relaxed sm:text-xl">
						Build your perfect TypeScript stack.
					</p>
				</motion.div>
			</div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, margin: "-50px" }}
				transition={{ duration: 0.6, delay: 0.2 }}
				className="relative border"
			>
				<StackArchitect />
			</motion.div>
		</section>
	);
}
