"use client";

import { AlertTriangle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { StackState } from "@/lib/constant";
import { cn } from "@/lib/utils";

interface YoloToggleProps {
	stack: StackState;
	onToggle: (yolo: string) => void;
}

export function YoloToggle({ stack, onToggle }: YoloToggleProps) {
	const isYoloEnabled = stack.yolo === "true";

	return (
		<Tooltip delayDuration={100}>
			<TooltipTrigger asChild>
				<div className="flex w-full items-center gap-3 p-3">
					<AlertTriangle className="h-4 w-4 flex-shrink-0" />
					<div className="flex flex-1 flex-col items-start">
						<div className="font-medium text-sm">YOLO Mode</div>
						<div className="text-muted-foreground text-xs">
							{isYoloEnabled ? "Enabled" : "Disabled"}
						</div>
					</div>
					<Switch
						checked={isYoloEnabled}
						onCheckedChange={(checked) => onToggle(checked ? "true" : "false")}
						className={cn(
							isYoloEnabled && "data-[state=checked]:bg-destructive",
						)}
					/>
				</div>
			</TooltipTrigger>
			<TooltipContent side="top" align="start" className="max-w-xs">
				<p className="text-xs">
					Disables all validation and adds --yolo flag to the command. Use at
					your own risk!
				</p>
			</TooltipContent>
		</Tooltip>
	);
}
