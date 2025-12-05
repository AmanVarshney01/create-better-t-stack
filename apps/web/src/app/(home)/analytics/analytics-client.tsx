"use client";

import { api } from "@better-t-stack/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import AnalyticsPage from "./_components/analytics-page";
import type {
	AggregatedAnalyticsData,
	Distribution,
} from "./_components/types";

type EventRow = {
	_id: string;
	_creationTime: number;
	event: string;
	database?: string;
	orm?: string;
	backend?: string;
	runtime?: string;
	frontend?: string[];
	addons?: string[];
	examples?: string[];
	auth?: string;
	payments?: string;
	git?: boolean;
	packageManager?: string;
	install?: boolean;
	dbSetup?: string;
	api?: string;
	webDeploy?: string;
	serverDeploy?: string;
	cli_version?: string;
	node_version?: string;
	platform?: string;
};

function count(map: Map<string, number>, key: string | undefined) {
	if (!key) return;
	map.set(key, (map.get(key) || 0) + 1);
}

function countBool(map: Map<string, number>, val: boolean | undefined) {
	if (val === undefined) return;
	const key = val ? "Yes" : "No";
	map.set(key, (map.get(key) || 0) + 1);
}

function countArray(map: Map<string, number>, arr: string[] | undefined) {
	if (!arr) return;
	for (const item of arr) {
		count(map, item);
	}
}

function toDistribution(map: Map<string, number>): Distribution {
	return Array.from(map.entries())
		.map(([name, value]) => ({ name, value }))
		.sort((a, b) => b.value - a.value);
}

function getMajorVersion(version: string | undefined) {
	if (!version) return "unknown";
	const clean = version.startsWith("v") ? version.slice(1) : version;
	return `v${clean.split(".")[0]}`;
}

function getMostPopular(dist: Distribution) {
	return dist.length > 0 ? dist[0].name : "none";
}

function aggregateEvents(events: EventRow[]): AggregatedAnalyticsData {
	const byDate = new Map<string, number>();
	const byMonth = new Map<string, number>();
	const byHour = new Map<string, number>();
	const platform = new Map<string, number>();
	const packageManager = new Map<string, number>();
	const backend = new Map<string, number>();
	const database = new Map<string, number>();
	const orm = new Map<string, number>();
	const dbSetup = new Map<string, number>();
	const apiLayer = new Map<string, number>();
	const frontend = new Map<string, number>();
	const auth = new Map<string, number>();
	const runtime = new Map<string, number>();
	const addons = new Map<string, number>();
	const examples = new Map<string, number>();
	const git = new Map<string, number>();
	const install = new Map<string, number>();
	const webDeploy = new Map<string, number>();
	const serverDeploy = new Map<string, number>();
	const payments = new Map<string, number>();
	const nodeVersion = new Map<string, number>();
	const cliVersion = new Map<string, number>();
	const stackCombo = new Map<string, number>();
	const dbOrmCombo = new Map<string, number>();

	for (const row of events) {
		const date = new Date(row._creationTime);
		const dayKey = date.toISOString().slice(0, 10);
		const monthKey = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
		const hourKey = String(date.getUTCHours()).padStart(2, "0");

		byDate.set(dayKey, (byDate.get(dayKey) || 0) + 1);
		byMonth.set(monthKey, (byMonth.get(monthKey) || 0) + 1);
		byHour.set(hourKey, (byHour.get(hourKey) || 0) + 1);

		count(platform, row.platform);
		count(packageManager, row.packageManager);
		count(backend, row.backend);
		count(database, row.database);
		count(orm, row.orm);
		count(dbSetup, row.dbSetup);
		count(apiLayer, row.api);
		countArray(frontend, row.frontend);
		count(auth, row.auth);
		count(runtime, row.runtime);
		countArray(addons, row.addons);
		countArray(examples, row.examples);
		countBool(git, row.git);
		countBool(install, row.install);
		count(webDeploy, row.webDeploy);
		count(serverDeploy, row.serverDeploy);
		count(payments, row.payments);
		count(nodeVersion, getMajorVersion(row.node_version));
		count(cliVersion, row.cli_version);

		const fe = row.frontend?.[0] || "none";
		const be = row.backend || "none";
		stackCombo.set(`${be} + ${fe}`, (stackCombo.get(`${be} + ${fe}`) || 0) + 1);

		const db = row.database || "none";
		const o = row.orm || "none";
		dbOrmCombo.set(`${db} + ${o}`, (dbOrmCombo.get(`${db} + ${o}`) || 0) + 1);
	}

	const totalProjects = events.length;
	const uniqueDays = byDate.size || 1;
	const avgProjectsPerDay = totalProjects / uniqueDays;
	const lastUpdated =
		events.length === 0
			? null
			: new Date(Math.max(...events.map((e) => e._creationTime))).toISOString();

	const timeSeries = Array.from(byDate.entries())
		.map(([date, count]) => ({ date, count }))
		.sort((a, b) => a.date.localeCompare(b.date));

	const monthlyTimeSeries = Array.from(byMonth.entries())
		.map(([month, count]) => ({ month, count }))
		.sort((a, b) => a.month.localeCompare(b.month));

	const hourlyDistribution = Array.from({ length: 24 }, (_, i) => {
		const hour = String(i).padStart(2, "0");
		return { hour: `${hour}:00`, count: byHour.get(hour) || 0 };
	});

	const platformDistribution = toDistribution(platform);
	const packageManagerDistribution = toDistribution(packageManager);
	const backendDistribution = toDistribution(backend);
	const databaseDistribution = toDistribution(database);
	const ormDistribution = toDistribution(orm);
	const dbSetupDistribution = toDistribution(dbSetup).filter(
		(d) => d.name !== "none",
	);
	const apiDistribution = toDistribution(apiLayer);
	const frontendDistribution = toDistribution(frontend);
	const authDistribution = toDistribution(auth);
	const runtimeDistribution = toDistribution(runtime);
	const addonsDistribution = toDistribution(addons);
	const examplesDistribution = toDistribution(examples);
	const gitDistribution = toDistribution(git);
	const installDistribution = toDistribution(install);
	const webDeployDistribution = toDistribution(webDeploy).filter(
		(d) => d.name !== "none",
	);
	const serverDeployDistribution = toDistribution(serverDeploy).filter(
		(d) => d.name !== "none",
	);
	const paymentsDistribution = toDistribution(payments).filter(
		(d) => d.name !== "none",
	);
	const nodeVersionDistribution = toDistribution(nodeVersion).map((d) => ({
		version: d.name,
		count: d.value,
	}));
	const cliVersionDistribution = toDistribution(cliVersion)
		.filter((d) => d.name !== "unknown")
		.slice(0, 10)
		.map((d) => ({ version: d.name, count: d.value }));
	const popularStackCombinations = toDistribution(stackCombo).slice(0, 8);
	const databaseORMCombinations = toDistribution(dbOrmCombo).slice(0, 8);

	return {
		lastUpdated,
		totalProjects,
		avgProjectsPerDay,
		timeSeries,
		monthlyTimeSeries,
		hourlyDistribution,
		platformDistribution,
		packageManagerDistribution,
		backendDistribution,
		databaseDistribution,
		ormDistribution,
		dbSetupDistribution,
		apiDistribution,
		frontendDistribution,
		authDistribution,
		runtimeDistribution,
		addonsDistribution,
		examplesDistribution,
		gitDistribution,
		installDistribution,
		webDeployDistribution,
		serverDeployDistribution,
		paymentsDistribution,
		nodeVersionDistribution,
		cliVersionDistribution,
		popularStackCombinations,
		databaseORMCombinations,
		summary: {
			mostPopularFrontend: getMostPopular(frontendDistribution),
			mostPopularBackend: getMostPopular(backendDistribution),
			mostPopularDatabase: getMostPopular(databaseDistribution),
			mostPopularORM: getMostPopular(ormDistribution),
			mostPopularAPI: getMostPopular(apiDistribution),
			mostPopularAuth: getMostPopular(authDistribution),
			mostPopularPackageManager: getMostPopular(packageManagerDistribution),
			mostPopularRuntime: getMostPopular(runtimeDistribution),
		},
	};
}

export function AnalyticsClient() {
	const events = useQuery(api.analytics.getAllEvents);

	if (events === undefined) {
		return (
			<div className="flex min-h-svh items-center justify-center">
				<div className="animate-pulse text-muted-foreground">
					Loading analytics data...
				</div>
			</div>
		);
	}

	const data = aggregateEvents(events as EventRow[]);
	return <AnalyticsPage data={data} />;
}
