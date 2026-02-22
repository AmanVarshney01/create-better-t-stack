"use client";

import { motion } from "motion/react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { TechIcon } from "@/components/ui/tech-icon";
import { cn } from "@/lib/utils";

type TechOption = {
  id: string;
  name: string;
  icon: string;
};

type FeatureCardProps = {
  title: string;
  description?: string;
  options: TechOption[];
  className?: string;
};

export default function FeatureCard({ title, options, className }: FeatureCardProps) {
  return (
    <motion.div
      className={cn(
        "relative flex h-36 flex-col overflow-hidden rounded-lg border border-border bg-fd-background p-2 shadow-sm",
        className,
      )}
      layout
    >
      <div>
        <h4 className="pb-2 text-center font-semibold text-foreground text-sm">{title}</h4>
      </div>
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full w-full">
          <ul className="grid grid-cols-3 gap-2 p-1">
            {options.map((option) => (
              <li key={option.id} title={option.name} className="flex items-center justify-center">
                <TechIcon
                  techId={option.id}
                  icon={option.icon}
                  name={option.name}
                  className="h-6 w-6 object-contain"
                />
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>
    </motion.div>
  );
}
