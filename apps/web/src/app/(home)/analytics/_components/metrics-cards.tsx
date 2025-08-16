import { Cpu, Download, Terminal, TrendingUp, Users } from "lucide-react";

interface MetricsCardsProps {
	totalProjects: number;
	avgProjectsPerDay: number;
	authEnabledPercent: number;
	mostPopularFrontend: string;
	mostPopularBackend: string;
	mostPopularORM: string;
	mostPopularAPI: string;
	mostPopularPackageManager: string;
}

export function MetricsCards({
	totalProjects,
	avgProjectsPerDay,
	authEnabledPercent,
	mostPopularFrontend,
	mostPopularBackend,
	mostPopularORM,
	mostPopularAPI,
	mostPopularPackageManager,
}: MetricsCardsProps) {
	return (
		<div className="space-y-4">
			<div className="mb-4 flex items-center gap-2">
				<span className="font-bold text-lg">SYSTEM_METRICS.LOG</span>
				<div className="h-px flex-1 bg-border" />
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
				<div className="rounded border border-border">
					<div className="border-border border-b px-4 py-3">
						<div className="flex items-center justify-between">
							<span className="font-semibold text-sm">TOTAL_PROJECTS</span>
							<Terminal className="h-4 w-4 text-primary" />
						</div>
					</div>
					<div className="p-4">
						<div className="font-bold text-2xl text-primary">
							{totalProjects.toLocaleString()}
						</div>
						<p className="mt-1 text-muted-foreground text-xs">
							$ ./create-better-t-stack executions
						</p>
					</div>
				</div>

				<div className="rounded border border-border">
					<div className="border-border border-b px-4 py-3">
						<div className="flex items-center justify-between">
							<span className="font-semibold text-sm">TOP_FRONTEND</span>
							<Cpu className="h-4 w-4 text-primary" />
						</div>
					</div>
					<div className="p-4">
						<div className="truncate font-bold text-accent text-lg">
							{mostPopularFrontend}
						</div>
						<p className="mt-1 text-muted-foreground text-xs">
							$ most_selected_frontend.sh
						</p>
					</div>
				</div>

				<div className="rounded border border-border">
					<div className="border-border border-b px-4 py-3">
						<div className="flex items-center justify-between">
							<span className="font-semibold text-sm">TOP_BACKEND</span>
							<Terminal className="h-4 w-4 text-primary" />
						</div>
					</div>
					<div className="p-4">
						<div className="truncate font-bold text-accent text-lg">
							{mostPopularBackend}
						</div>
						<p className="mt-1 text-muted-foreground text-xs">
							$ most_selected_backend.sh
						</p>
					</div>
				</div>

				<div className="rounded border border-border">
					<div className="border-border border-b px-4 py-3">
						<div className="flex items-center justify-between">
							<span className="font-semibold text-sm">TOP_ORM</span>
							<Download className="h-4 w-4 text-primary" />
						</div>
					</div>
					<div className="p-4">
						<div className="truncate font-bold text-accent text-lg">
							{mostPopularORM}
						</div>
						<p className="mt-1 text-muted-foreground text-xs">
							$ most_selected_orm.sh
						</p>
					</div>
				</div>

				<div className="rounded border border-border">
					<div className="border-border border-b px-4 py-3">
						<div className="flex items-center justify-between">
							<span className="font-semibold text-sm">TOP_API</span>
							<TrendingUp className="h-4 w-4 text-primary" />
						</div>
					</div>
					<div className="p-4">
						<div className="truncate font-bold text-accent text-lg">
							{mostPopularAPI}
						</div>
						<p className="mt-1 text-muted-foreground text-xs">
							$ most_selected_api.sh
						</p>
					</div>
				</div>

				<div className="rounded border border-border">
					<div className="border-border border-b px-4 py-3">
						<div className="flex items-center justify-between">
							<span className="font-semibold text-sm">AUTH_ADOPTION</span>
							<Users className="h-4 w-4 text-primary" />
						</div>
					</div>
					<div className="p-4">
						<div className="font-bold text-2xl text-primary">
							{authEnabledPercent}%
						</div>
						<p className="mt-1 text-muted-foreground text-xs">
							$ auth_enabled_percentage.sh
						</p>
					</div>
				</div>

				<div className="rounded border border-border">
					<div className="border-border border-b px-4 py-3">
						<div className="flex items-center justify-between">
							<span className="font-semibold text-sm">TOP_PKG_MGR</span>
							<Terminal className="h-4 w-4 text-primary" />
						</div>
					</div>
					<div className="p-4">
						<div className="truncate font-bold text-accent text-lg">
							{mostPopularPackageManager}
						</div>
						<p className="mt-1 text-muted-foreground text-xs">
							$ most_used_package_manager.sh
						</p>
					</div>
				</div>

				<div className="rounded border border-border">
					<div className="border-border border-b px-4 py-3">
						<div className="flex items-center justify-between">
							<span className="font-semibold text-sm">AVG_DAILY</span>
							<TrendingUp className="h-4 w-4 text-primary" />
						</div>
					</div>
					<div className="p-4">
						<div className="font-bold text-2xl text-primary">
							{avgProjectsPerDay.toFixed(1)}
						</div>
						<p className="mt-1 text-muted-foreground text-xs">
							$ average_projects_per_day.sh
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
