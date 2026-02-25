import { describe, expect, it } from "bun:test";

import type { SponsorEntry } from "../src/utils/sponsors";

import { formatPostInstallSpecialSponsorsSection } from "../src/utils/sponsors";

function createSponsorsFixture(): SponsorEntry {
  return {
    generated_at: "2026-02-25T00:00:00.000Z",
    summary: {
      total_sponsors: 3,
      total_lifetime_amount: 300,
      total_current_monthly: 100,
      special_sponsors: 3,
      current_sponsors: 3,
      past_sponsors: 0,
      backers: 0,
      top_sponsor: {
        name: "Ada",
        amount: 100,
      },
    },
    specialSponsors: [
      {
        githubId: "ada",
        githubUrl: "https://github.com/ada",
        avatarUrl: "https://example.com/ada.png",
        tierName: "Pro",
        sinceWhen: "2025-01",
        transactionCount: 8,
        name: "Ada",
      },
      {
        githubId: "grace",
        githubUrl: "https://github.com/grace",
        avatarUrl: "https://example.com/grace.png",
        tierName: "Starter",
        sinceWhen: "2025-02",
        transactionCount: 5,
        name: "Grace",
      },
      {
        githubId: "linus",
        githubUrl: "https://github.com/linus",
        avatarUrl: "https://example.com/linus.png",
        sinceWhen: "2025-03",
        transactionCount: 3,
        name: "Linus",
      },
    ],
    sponsors: [],
    pastSponsors: [],
    backers: [],
  };
}

describe("formatPostInstallSpecialSponsorsSection", () => {
  it("returns empty output when no special sponsors exist", () => {
    const fixture = createSponsorsFixture();
    fixture.specialSponsors = [];

    const output = formatPostInstallSpecialSponsorsSection(fixture);
    expect(output).toBe("");
  });

  it("renders all special sponsors without tier details or sponsor link", () => {
    const fixture = createSponsorsFixture();

    const output = formatPostInstallSpecialSponsorsSection(fixture);
    expect(output).toContain("Special sponsors");
    expect(output).toContain("Ada");
    expect(output).toContain("Grace");
    expect(output).toContain("Linus");
    expect(output).toContain("• Ada");
    expect(output).not.toContain("Pro");
    expect(output).not.toContain("Starter");
    expect(output).not.toContain("Become a sponsor");
  });
});
