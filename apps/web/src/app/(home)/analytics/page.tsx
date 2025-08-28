import AnalyticsPage from "./_components/analytics-page";

export default async function Analytics() {
	const response = await fetch(
		"https://r2.better-t-stack.dev/analytics-data.json",
	);
	const analyticsData = await response.json();

	return <AnalyticsPage data={analyticsData} />;
}
