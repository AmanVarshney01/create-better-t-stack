import type { Sponsor } from "@/lib/types";

export const SPECIAL_SPONSOR_THRESHOLD = 100;

export const calculateLifetimeContribution = (sponsor: Sponsor): number => {
  // totalProcessedAmount is always provided by the API
  return sponsor.totalProcessedAmount || 0;
};

export const shouldShowLifetimeTotal = (sponsor: Sponsor): boolean => {
  // Only show lifetime total if totalProcessedAmount exists and tierName is present
  return sponsor.totalProcessedAmount !== undefined && !!sponsor.tierName;
};

export const isLifetimeSpecialSponsor = (sponsor: Sponsor): boolean => {
  const lifetimeAmount = calculateLifetimeContribution(sponsor);
  return lifetimeAmount >= SPECIAL_SPONSOR_THRESHOLD;
};

export const getSponsorUrl = (sponsor: Sponsor): string => {
  const url = sponsor.websiteUrl || sponsor.githubUrl;

  // Ensure URL has a protocol
  if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }

  return url;
};

export const formatSponsorUrl = (url: string): string => {
  return url?.replace(/^https?:\/\//, "")?.replace(/\/$/, "");
};
