import { isCancel, select } from "@clack/prompts";
import { DEFAULT_CONFIG } from "../constants";
import {
	type Auth,
	type Backend,
	type Frontend,
	type Payments,
	PaymentsSchema,
} from "../types";
import { splitFrontends } from "../utils/compatibility-rules";
import { exitCancelled } from "../utils/errors";

function getPaymentsDisplay(payments: Payments): {
	label: string;
	hint: string;
} {
	let label: string;
	let hint: string;

	switch (payments) {
		case "polar":
			label = "Polar";
			hint = "Payments and subscriptions made simple";
			break;
		case "none":
			label = "None";
			hint = "No payments integration";
			break;
	}

	return { label, hint };
}

export async function getPaymentsChoice(
	payments?: Payments,
	auth?: Auth,
	backend?: Backend,
	frontends?: Frontend[],
) {
	if (payments !== undefined) return payments;

	const allPayments = PaymentsSchema.options.filter(
		(payment) => payment !== "none",
	);
	const options = [];

	for (const payment of allPayments) {
		if (payment === "polar") {
			if (!auth || auth === "none" || auth !== "better-auth") {
				continue;
			}

			if (backend === "convex") {
				continue;
			}

			const { web } = splitFrontends(frontends);
			if (web.length === 0 && frontends && frontends.length > 0) {
				continue;
			}
		}

		const { label, hint } = getPaymentsDisplay(payment);
		options.push({
			value: payment,
			label,
			hint,
		});
	}

	options.push({
		value: "none" as Payments,
		label: "None",
		hint: "No payments integration",
	});

	const response = await select<Payments>({
		message: "Select payments provider",
		options,
		initialValue: DEFAULT_CONFIG.payments,
	});

	if (isCancel(response)) return exitCancelled("Operation cancelled");

	return response;
}
