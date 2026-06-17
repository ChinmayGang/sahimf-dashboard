export interface NewsItem {
  id: string
  headline: string
  source: string
  sourceUrl?: string
  publishedAt: string
  category: 'Fund Update' | 'Market News' | 'AMC News' | 'Regulatory' | 'Performance'
  summary: string
  body: string
}

export const FUND_NEWS: Record<string, NewsItem[]> = {
  f001: [
    {
      id: 'f001-n1',
      headline: 'Mirae Asset Large Cap Fund maintains top-quartile ranking for 5th consecutive quarter',
      source: 'Economic Times',
      publishedAt: '2026-06-14T09:30:00',
      category: 'Performance',
      summary: "The fund's disciplined bottom-up approach and low portfolio churn have helped it sustain outperformance vs peers.",
      body: "Mirae Asset Large Cap Fund continued its streak of top-quartile performance, ranking 2nd among 30+ large cap schemes on a 3Y rolling return basis. Fund manager attributed consistent stock selection in banking and IT to the sustained alpha. The fund added positions in two new PSU banks in Q1 2026 while trimming consumer discretionary. AUM grew to ₹41,200 Cr, crossing a new milestone.",
    },
    {
      id: 'f001-n2',
      headline: 'Mirae Asset MF to launch new NFO in the thematic energy transition space',
      source: 'Mint',
      publishedAt: '2026-06-10T11:15:00',
      category: 'AMC News',
      summary: 'Mirae Asset plans to file for a new thematic fund focused on energy transition, EVs, and green hydrogen.',
      body: "Mirae Asset Mutual Fund filed a draft SID with SEBI for a new Energy Transition Fund. The fund intends to invest in companies across solar, wind, EV charging, and green hydrogen verticals. The NFO is expected to open in August 2026. Mirae Asset currently manages 14 equity schemes with total AUM exceeding ₹1.4 lakh crore.",
    },
    {
      id: 'f001-n3',
      headline: 'Expense ratio cut: Mirae Asset trims TER on direct plans from 0.59% to 0.54%',
      source: 'Business Standard',
      publishedAt: '2026-06-02T08:00:00',
      category: 'Fund Update',
      summary: "Benefit passed on to investors as the fund's AUM crossed ₹40,000 Cr slab.",
      body: "Mirae Asset Mutual Fund reduced the Total Expense Ratio on its Large Cap Fund direct plan from 0.59% to 0.54%, effective June 1, 2026. The reduction was mandated under SEBI's TER slabs once the AUM crossed the ₹40,000 Cr threshold. On a ₹10 lakh investment held over 5 years, this translates to approximately ₹2,500 in additional returns.",
    },
  ],
  f002: [
    {
      id: 'f002-n1',
      headline: 'Parag Parikh Flexi Cap increases allocation to international equities to 25%',
      source: 'Mint',
      publishedAt: '2026-06-15T10:00:00',
      category: 'Fund Update',
      summary: 'PPFAS has been adding to Meta and Alphabet positions as the international equities valuation comfort improved.',
      body: "Parag Parikh Flexi Cap Fund increased its international equity allocation from 19% to 25% in June 2026, adding to positions in Meta Platforms and Alphabet Inc. The fund management team cited compelling valuations after the recent correction in US large-cap tech. The fund remains the largest active flexi-cap fund with AUM exceeding ₹62,000 Cr.",
    },
    {
      id: 'f002-n2',
      headline: 'PPFAS MF clarifies stance on no distributor commissions in its annual disclosure',
      source: 'Value Research Online',
      publishedAt: '2026-06-08T14:30:00',
      category: 'AMC News',
      summary: "Annual transparency report reaffirms PPFAS's stance on direct-only distribution and no upfront or trail commissions.",
      body: "PPFAS Mutual Fund released its annual transparency report, reaffirming the AMC's stance on accepting no upfront commissions or trail fees from distributors for its schemes. The fund house also disclosed all related-party transactions for FY2025-26. PPFAS has been growing primarily via direct investors — over 82% of its AUM is in direct plans.",
    },
    {
      id: 'f002-n3',
      headline: 'Parag Parikh adds ITC, reduces HUL in latest portfolio reshuffle',
      source: 'Economic Times',
      publishedAt: '2026-05-28T09:00:00',
      category: 'Fund Update',
      summary: "Portfolio changes reflect the fund's bet on cigarette-to-hotels diversification paying off in FY27.",
      body: "Parag Parikh Flexi Cap Fund initiated a fresh position in ITC Ltd while trimming Hindustan Unilever in its May 2026 portfolio. The fund manager believes ITC's diversification into FMCG, hospitality and agribusiness makes it undervalued at current levels. The fund also exited its position in Persistent Systems, booking 38% gains.",
    },
  ],
  f003: [
    {
      id: 'f003-n1',
      headline: 'DSP Natural Resources fund up 19.8% YTD — clean energy rally continues',
      source: 'Economic Times',
      publishedAt: '2026-06-13T08:30:00',
      category: 'Performance',
      summary: "Strong performance driven by oil & gas refining stocks and new energy holdings in solar and wind.",
      body: "DSP Natural Resources & New Energy Fund delivered 19.8% returns year-to-date, significantly outperforming its benchmark. Key contributors were Reliance Industries (up 22%), Bharat Petroleum (up 18%), and Tata Steel (up 31%). The fund's allocation to clean energy names — through international fund-of-funds — contributed 3.2% to overall performance.",
    },
    {
      id: 'f003-n2',
      headline: "Government announces ₹2.4 lakh crore green energy capex — sectoral tailwind",
      source: 'Mint',
      publishedAt: '2026-06-09T12:00:00',
      category: 'Market News',
      summary: 'Budget 2026-27 capex allocation to renewable energy and green hydrogen is a strong tailwind for energy funds.',
      body: "The Union Budget 2026-27 announced a ₹2.4 lakh crore capital expenditure for renewable energy infrastructure including solar, wind, and green hydrogen. Analysts expect this to directly benefit companies held in DSP's portfolio — particularly Reliance New Energy, NTPC Renewable, and Adani Green. Fund managers in the energy-sectoral space are calling this a decade-long structural tailwind.",
    },
    {
      id: 'f003-n3',
      headline: 'DSP MF completes integration of international energy fund-of-funds basket',
      source: 'Business Standard',
      publishedAt: '2026-05-20T10:00:00',
      category: 'Fund Update',
      summary: "The FoF allocation to BlackRock Sustainable Energy and World Energy funds has been fully rebalanced.",
      body: "DSP Mutual Fund completed the rebalancing of its international fund-of-funds allocation within the Natural Resources fund. The fund now holds 9.19% in BlackRock Global Funds - World Energy Fund (Class I2) and 3.93% in BlackRock Global Funds - Sustainable Energy Fund. The restructuring was done to align the fund's global exposure with the latest energy transition themes.",
    },
  ],
  f004: [
    {
      id: 'f004-n1',
      headline: 'Axis Bluechip Fund restructures banking allocation after RBI rate pivot',
      source: 'Mint',
      publishedAt: '2026-06-12T11:00:00',
      category: 'Fund Update',
      summary: "Fund reduces private bank weightage, adds to HDFC Bank as rate cut cycle benefits NIMs.",
      body: "Axis Bluechip Fund adjusted its banking sector allocation after the RBI's rate cut cycle began in April 2026. The fund increased its position in HDFC Bank and ICICI Bank while reducing exposure to Axis Bank — noting that larger private banks stand to benefit more from NIM expansion. Financial sector allocation now stands at 34.2% of the portfolio.",
    },
    {
      id: 'f004-n2',
      headline: 'Axis MF introduces monthly SIP date flexibility for all equity schemes',
      source: 'Business Standard',
      publishedAt: '2026-06-05T09:00:00',
      category: 'AMC News',
      summary: "Investors can now choose any date from 1st to 28th for SIP mandates across Axis Mutual Fund equity schemes.",
      body: "Axis Mutual Fund announced the introduction of flexible SIP dates for all its equity schemes starting July 1, 2026. Investors can now select any date between the 1st and 28th of each month for their SIP mandates, up from the earlier fixed-date options. This is in line with SEBI's broader push to make mutual funds more accessible to first-time investors.",
    },
  ],
  f005: [
    {
      id: 'f005-n1',
      headline: "HDFC Mid-Cap Opportunities crosses ₹60,000 Cr AUM — largest mid-cap fund",
      source: 'Economic Times',
      publishedAt: '2026-06-16T08:00:00',
      category: 'AMC News',
      summary: "The fund has seen consistent inflows of ₹2,200-2,500 Cr per month through SIPs over the past year.",
      body: "HDFC Mid-Cap Opportunities Fund became the largest mid-cap mutual fund in India, crossing ₹60,000 Cr in AUM in June 2026. The fund recorded net inflows of ₹2,418 Cr in May 2026 alone, driven primarily by SIP investors. Fund manager cited healthcare, auto-ancillaries, and specialty chemicals as sectors where they continue to find value in the mid-cap space.",
    },
    {
      id: 'f005-n2',
      headline: 'Mid-cap rally set to continue as Q4 FY26 earnings beat estimates by 11%',
      source: 'Mint',
      publishedAt: '2026-06-11T10:30:00',
      category: 'Market News',
      summary: 'Mid-cap companies delivered 11% earnings beat in Q4 FY26, with healthcare and chemicals leading the pack.',
      body: "Mid-cap companies in the BSE Midcap 150 Index delivered an average 11% earnings beat in Q4 FY26, driven by margin expansion in specialty chemicals, healthcare generics, and auto components. Analysts at multiple brokerages have revised mid-cap earnings estimates upward for FY27. HDFC Mid-Cap Opportunities Fund, with heavy exposure to these sectors, is seen as a key beneficiary.",
    },
    {
      id: 'f005-n3',
      headline: 'HDFC MF adds Trent, Kalyan Jewellers to mid-cap portfolio in Q1 2026',
      source: 'Value Research Online',
      publishedAt: '2026-06-01T12:00:00',
      category: 'Fund Update',
      summary: "Two new additions reflect the fund's conviction on consumption upgrade theme among tier-2 and tier-3 cities.",
      body: "HDFC Mid-Cap Opportunities Fund initiated positions in Trent Ltd and Kalyan Jewellers in Q1 2026, reflecting growing conviction on the consumption upgrade theme in India's tier-2 and tier-3 cities. The fund exited Persistent Systems and reduced Cholamandalam Finance. The revised portfolio has 68 stocks with the top 10 holdings accounting for 31% of assets.",
    },
  ],
  f006: [
    {
      id: 'f006-n1',
      headline: 'SBI Small Cap Fund closes for fresh lumpsum investments citing deployment constraints',
      source: 'Business Standard',
      publishedAt: '2026-06-14T09:00:00',
      category: 'Fund Update',
      summary: "The fund temporarily pauses fresh lumpsum subscriptions while keeping SIP window open.",
      body: "SBI Small Cap Fund temporarily suspended fresh lumpsum subscriptions for the second time in three years, citing deployment constraints in the small-cap segment. The fund will continue accepting SIP and STP mandates. Fund manager noted that quality small-cap stocks are getting expensive and the team needs time to identify new opportunities at favorable entry points. The fund AUM stands at ₹22,480 Cr.",
    },
    {
      id: 'f006-n2',
      headline: 'Small-cap segment delivers 32% returns in 1Y — caution warranted going forward',
      source: 'Economic Times',
      publishedAt: '2026-06-08T11:00:00',
      category: 'Market News',
      summary: 'Analysts warn of frothy valuations in small-caps after the sharp run-up, advising investors to stagger investments.',
      body: "The BSE SmallCap 250 Index has returned 32.4% over the past 12 months, significantly ahead of large-caps. While earnings growth has supported part of the rally, valuations in several pockets are now stretched at 35-40x forward P/E. Financial planners recommend staggered SIPs rather than lumpsum deployment in small-cap funds at current levels. SBI Small Cap Fund itself has outperformed its benchmark by 4.2% over the same period.",
    },
  ],
  f007: [
    {
      id: 'f007-n1',
      headline: "ICICI Prudential BAF shifts to 65% equity after model signals undervaluation",
      source: 'Mint',
      publishedAt: '2026-06-13T10:00:00',
      category: 'Fund Update',
      summary: "The fund's proprietary valuation model signaled equity increase after P/E correction in April-May 2026.",
      body: "ICICI Prudential Balanced Advantage Fund increased its gross equity allocation to 65% from 58% in June 2026, following a signal from its proprietary valuation model that flagged market undervaluation after the April-May correction. The fund's model uses a combination of P/E ratio, P/B ratio, and earnings yield vs bond yield spread to dynamically adjust equity-debt mix.",
    },
    {
      id: 'f007-n2',
      headline: "Balanced advantage funds attract ₹8,200 Cr net inflows in May — risk-off pivot by investors",
      source: 'Business Standard',
      publishedAt: '2026-06-06T09:00:00',
      category: 'Market News',
      summary: 'Investors moved to hybrid and BAF funds as global uncertainty drove caution in pure equity allocations.',
      body: "Balanced Advantage Funds collectively attracted ₹8,200 Cr in net inflows in May 2026, the highest in 18 months. ICICI Prudential BAF, the largest fund in the category, alone received ₹2,100 Cr. Financial advisors attribute the shift to global geopolitical uncertainty prompting investors to move from pure equity to hybrid allocation products.",
    },
  ],
  f008: [
    {
      id: 'f008-n1',
      headline: 'RBI rate cut of 50 bps in April boosts gilt fund returns to 7.4% in 1Y',
      source: 'Economic Times',
      publishedAt: '2026-06-15T08:30:00',
      category: 'Performance',
      summary: "Rate cuts drove strong mark-to-market gains in long-duration government securities held by the fund.",
      body: "Kotak Gilt Fund delivered 7.4% returns over the past year, driven by the RBI's cumulative 50 bps rate cut in April 2026. Long-duration government securities rallied sharply as yields fell from 7.1% to 6.65%. The fund's duration of 12.8 years amplified the mark-to-market gains. Analysts expect further rate cuts in H2 2026, which could extend the gilt fund rally.",
    },
    {
      id: 'f008-n2',
      headline: 'SEBI mandates enhanced credit risk disclosures for all debt mutual funds',
      source: 'Business Standard',
      publishedAt: '2026-06-07T10:00:00',
      category: 'Regulatory',
      summary: "New SEBI circular requires debt funds to disclose portfolio's credit quality distribution on a monthly basis.",
      body: "SEBI issued a circular mandating all debt mutual funds to disclose portfolio credit quality distribution monthly, effective August 1, 2026. The new format requires funds to break down holdings by AAA/AA+/AA/A and below-investment-grade categories. Gilt funds like Kotak Gilt Fund, which invest exclusively in government securities (effectively AAA-equivalent), are least impacted by this disclosure requirement.",
    },
  ],
}
