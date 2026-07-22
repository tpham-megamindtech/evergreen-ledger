// One-off content generator for sample Markdown articles.
// Run: node scripts/generate-articles.mjs [category-slug]
import fs from "fs";
import path from "path";

const OUT_DIR = path.join(process.cwd(), "content", "articles");
fs.mkdirSync(OUT_DIR, { recursive: true });

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function pick(arr, seed) {
  return arr[seed % arr.length];
}

// index 0 = most recent. Spreads n2026 dates across Jan 1 - Jul 21 2026,
// and n2025 dates across Jun 1 - Dec 31 2025, descending (newest first).
function genDates(n2026, n2025) {
  const dates = [];
  for (let i = 0; i < n2026; i++) {
    const frac = n2026 > 1 ? i / (n2026 - 1) : 0;
    const dayOffset = Math.round(200 - frac * 200);
    const d = new Date(Date.UTC(2026, 0, 1));
    d.setUTCDate(d.getUTCDate() + dayOffset);
    dates.push(d.toISOString().slice(0, 10));
  }
  for (let i = 0; i < n2025; i++) {
    const frac = n2025 > 1 ? i / (n2025 - 1) : 0;
    const dayOffset = Math.round(213 - frac * 213);
    const d = new Date(Date.UTC(2025, 5, 1));
    d.setUTCDate(d.getUTCDate() + dayOffset);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

const FIRST_NAMES = [
  "Sarah", "James", "Maria", "Robert", "Ashley", "Michael", "Jennifer", "David",
  "Amanda", "Chris", "Emily", "Brian", "Megan", "Kevin", "Laura", "Daniel",
  "Nicole", "Andrew", "Rachel", "Tyler",
];
const LAST_NAMES = [
  "Johnson", "Ramirez", "Nguyen", "Davis", "Torres", "Wilson", "Moore", "Castillo",
  "Anderson", "Reyes", "Jackson", "White", "Ortega", "Martin", "Delgado",
  "Garcia", "Robinson", "Clark", "Silva", "Walker",
];

function personName(seed) {
  return `${pick(FIRST_NAMES, seed)} ${pick(LAST_NAMES, seed + 7)}`;
}

const ROLES = {
  "beauty-wellness": ["spa owner", "licensed esthetician", "wellness director", "master stylist", "clinic founder"],
  "finance-economy": ["regional economist", "chamber of commerce director", "city finance director", "economic development officer", "credit union spokesperson"],
  "business-leaders": ["chief executive", "founder", "managing partner", "board chair", "chief operating officer"],
  education: ["superintendent", "school principal", "college spokesperson", "program director", "district board chair"],
  healthcare: ["hospital administrator", "chief medical officer", "clinic director", "public health officer", "nursing director"],
};

const BODY_INTROS = {
  "beauty-wellness": (city) =>
    `The news comes as wellness businesses across ${city} report steady demand from longtime regulars and a growing number of newcomers drawn to the Puget Sound lifestyle.`,
  "finance-economy": (city) =>
    `The update adds to a string of recent economic developments across ${city}, part of a broader trend reshaping local balance sheets this year.`,
  "business-leaders": (city) =>
    `The announcement is the latest sign of momentum for ${city}'s business community, which has drawn growing attention from investors across the Pacific Northwest.`,
  education: (city) =>
    `District and campus leaders in ${city} say the change reflects months of planning and input from families, faculty, and students.`,
  healthcare: (city) =>
    `Health officials in ${city} say the move is meant to keep pace with a fast-growing population and rising demand for local care.`,
};

const BODY_DETAILS = {
  "beauty-wellness": (city, seed) =>
    `Staff say appointment requests have climbed roughly ${10 + (seed % 30)} percent since word spread locally. The business currently employs ${3 + (seed % 12)} licensed practitioners and plans to add more positions if demand keeps pace.`,
  "finance-economy": (city, seed) =>
    `Analysts point to ${city}'s expanding workforce and comparatively steady cost of doing business relative to Seattle's core. The shift is expected to affect roughly ${20 + (seed % 130)} million dollars in local economic activity over the next two years, according to figures reviewed by the Evergreen Ledger.`,
  "business-leaders": (city, seed) =>
    `The company now employs roughly ${15 + (seed % 200)} people across its Washington operations, with plans to keep hiring if growth holds through next year. Leadership says ${city}'s talent pipeline was a deciding factor in choosing to expand locally rather than out of state.`,
  education: (city, seed) =>
    `The plan affects roughly ${300 + seed * 41} students this year, with additional phases expected over the next ${1 + (seed % 3)} to ${2 + (seed % 3)} school years. Officials say funding is already in place for the first phase.`,
  healthcare: (city, seed) =>
    `The expansion is expected to add roughly ${20 + (seed % 60)} new positions, including clinical and support staff, and comes as regional population growth pushes demand for care to record levels.`,
};

const BODY_CLOSERS = {
  "beauty-wellness": () =>
    `Those interested can book online or by phone, and walk-ins are welcome as availability allows.`,
  "finance-economy": () =>
    `Local officials say they will continue tracking the impact on jobs and tax revenue in the months ahead.`,
  "business-leaders": () =>
    `Company leadership says an update on hiring and expansion plans is expected before the end of the year.`,
  education: () =>
    `Families can find updates and opportunities to comment through the district's official channels in the weeks ahead.`,
  healthcare: () =>
    `Patients are encouraged to check with their provider directly for scheduling as the new services come online.`,
};

function buildBody(category, city, seed) {
  const role = pick(ROLES[category], seed);
  const name = personName(seed);
  const intro = BODY_INTROS[category](city);
  const detail = BODY_DETAILS[category](city, seed);
  const closer = BODY_CLOSERS[category]();

  const quotes = [
    `"This is something our community has been asking for, and we're glad to finally see it come together," said ${name}, ${role} in ${city}.`,
    `"We've put a lot of work into getting this right, and people are already noticing the difference," said ${name}, ${role} in ${city}.`,
    `"It's a big step forward for ${city}, and it wouldn't have happened without a lot of people pulling in the same direction," said ${name}, ${role}.`,
  ];
  const quote = pick(quotes, seed);

  const pullQuotes = [
    `"We're proud of what this means for ${city} and the people who live here."`,
    `"This is exactly the kind of progress our community deserves."`,
    `"It took teamwork, but we got there."`,
  ];
  const pullQuote = pick(pullQuotes, seed + 3);

  return `${intro}

${quote}

${detail}

> ${pullQuote} — ${name}

${closer}`;
}

const IMG = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&h=800&q=80`;
const CREDIT = "Unsplash";

const CATEGORY_DATA = {
  "beauty-wellness": {
    name: "Beauty & Wellness",
    split: [14, 3],
    items: [
      ["Evergreen Glow Spa Opens Second Location in Capitol Hill", "A Seattle spa is expanding into Capitol Hill with a full-service second location.", "Seattle", IMG("1470259078422-826894b933aa")],
      ["Lakeside Skin Studio Adds Advanced Facial Treatment Line", "A Bellevue skin studio introduced a new line of advanced facial treatments.", "Bellevue", IMG("1487412720507-e7ab37603c6f")],
      ["Riverfront Wellness Collective Expands Massage Therapy Team", "A Spokane wellness studio added several licensed massage therapists to meet demand.", "Spokane", IMG("1512290923902-8a9f81dc236c")],
      ["Tide and Timber Salon Wins Regional Small Business Award", "A Tacoma salon was recognized with a regional small-business honor this quarter.", "Tacoma", IMG("1519415510236-718bdfcd89c8")],
      ["Bay Botanicals Spa Debuts Locally Sourced Skincare Line", "A Bellingham spa launched a skincare line built around regionally sourced ingredients.", "Bellingham", IMG("1519415943484-9fa1873496d4")],
      ["Redmond Ridge Wellness Center Adds Cryotherapy Suite", "A Redmond wellness center added a new cryotherapy suite to its recovery offerings.", "Redmond", IMG("1522337360788-8b13dee7a37e")],
      ["Waterfront Beauty Bar Trains Five New Estheticians", "A Kirkland beauty bar is investing in its team through a new local training program.", "Kirkland", IMG("1540555700478-4be289fbecef")],
      ["Capitol Row Salon Celebrates Ten Years Downtown", "An Olympia salon marked a decade in business with a community open house.", "Olympia", IMG("1544161515-4ab6ce6db874")],
      ["Port Gardner Spa Launches Membership Wellness Program", "An Everett spa introduced a new membership program for recurring treatments.", "Everett", IMG("1552693673-1bf958298935")],
      ["Columbia Valley Skin Clinic Opens Second Treatment Suite", "A Vancouver skin clinic opened a second suite to handle growing appointment demand.", "Vancouver", IMG("1560750588-73207b1ef5b8")],
      ["Blue Mountain Spa Adds Vineyard-Inspired Treatment Menu", "A Walla Walla spa introduced a new treatment menu inspired by the local wine country.", "Walla Walla", IMG("1571875257727-256c39da42af")],
      ["Valley Bloom Salon Named Small Business of the Year", "A Yakima salon was named small business of the year by a regional trade group.", "Yakima", IMG("1583417319070-4a69db38a482")],
      ["Cascade Foothills Wellness Studio Expands Yoga Schedule", "An Issaquah wellness studio added new class times to meet growing interest.", "Issaquah", IMG("1600334129128-685c5582fd35")],
      ["Rainier Valley Nail Bar Opens Third Location", "A Puyallup-based nail bar chain opened its third location this year.", "Puyallup", IMG("1607779097040-26e80aa78e66")],
      ["Cedar River Spa Adds Licensed Massage Therapists", "A Renton spa expanded its massage therapy team to shorten booking wait times.", "Renton", IMG("1620733723572-11c53f73a416")],
      ["Orchard Valley Salon Debuts Mobile Beauty Service", "A Wenatchee salon launched a mobile service bringing stylists to clients at home.", "Wenatchee", IMG("1633681926022-84c23e8cb2d6")],
      ["North Creek Wellness Studio Adds Infrared Sauna Room", "A Bothell wellness studio added a new infrared sauna room to its facility.", "Bothell", IMG("1633681926035-ec1ac984418a")],
    ],
  },
  "finance-economy": {
    name: "Finance & Economy",
    split: [14, 3],
    items: [
      ["Puget Sound Bank Reports Record Small-Business Lending", "A Seattle-based bank says small-business loan volume hit an all-time high last quarter.", "Seattle", IMG("1444653614773-995cb1ef9efa")],
      ["Eastside Credit Union Surpasses Three Billion in Assets", "A Bellevue credit union reached a new milestone in total assets this quarter.", "Bellevue", IMG("1450101499163-c8848c66ca85")],
      ["Spokane River Capital Closes Sixty Million Dollar Growth Fund", "A Spokane investment firm closed a new fund aimed at expansion-stage companies.", "Spokane", IMG("1454165804606-c3d57bc86b40")],
      ["Tacoma Tideflats Industrial District Adds Five Hundred Jobs", "New job figures show Tacoma's industrial district growing faster than the statewide average.", "Tacoma", IMG("1460925895917-afdab827c52f")],
      ["State Capital Region Office Vacancy Hits Five-Year Low", "Office space near Olympia's capitol campus is filling up at the fastest pace in five years.", "Olympia", IMG("1486406146926-c627a92ad1ab")],
      ["Redmond Tech Corridor Drives Record City Tax Revenue", "Redmond's expanding tech sector pushed city tax revenue to a new high.", "Redmond", IMG("1518186285589-2f7649de83e0")],
      ["Everett Ranks Among Fastest-Growing Local Economies in Northwest", "A new regional index ranks Everett among the fastest-growing local economies in the Pacific Northwest.", "Everett", IMG("1520607162513-77705c0f0d4a")],
      ["Vancouver Waterfront District Sees Record Sales Tax Collections", "Vancouver reported record sales tax collections tied to its growing waterfront district.", "Vancouver", IMG("1526304640581-d334cdbbf45e")],
      ["Kirkland Lakefront Office Leasing Hits New High", "Office leasing along Kirkland's lakefront reached a new high this quarter.", "Kirkland", IMG("1543286386-713bdd548da4")],
      ["Bellingham Bay Ferry Traffic Lifts Local Retail Economy", "Rising ferry traffic through Bellingham Bay is giving local retailers a revenue boost.", "Bellingham", IMG("1554224155-6726b3ff858f")],
      ["Renton Logistics Park Breaks Ground on Second Phase", "Developers broke ground on a second phase of a major Renton logistics park.", "Renton", IMG("1560472354-b33ff0c44a43")],
      ["Yakima Valley Agriculture Exports Hit Record Value", "Yakima Valley's agricultural exporters reported record shipment values this season.", "Yakima", IMG("1563986768609-322da13575f3")],
      ["Walla Walla Wine Country Tourism Revenue Climbs", "Visitor spending across Walla Walla's wine country climbed again this year.", "Walla Walla", IMG("1579532536935-619928decd08")],
      ["Wenatchee Valley Fruit Exports Lift Regional Economy", "A strong harvest season delivered a revenue boost to Wenatchee-area exporters.", "Wenatchee", IMG("1579621970563-ebec7560ff3e")],
      ["Issaquah Highlands Retail Vacancy Falls to Decade Low", "Retail vacancy in the Issaquah Highlands shopping district fell to its lowest point in ten years.", "Issaquah", IMG("1590283603385-17ffb3a7f29f")],
      ["Puyallup Fairgrounds District Sees Record Event Revenue", "The district surrounding the Puyallup fairgrounds reported record event-driven revenue.", "Puyallup", IMG("1591696331111-ef9586a5b17a")],
      ["Bothell Biotech Corridor Adds Three Hundred Jobs in a Year", "New job figures show Bothell's biotech corridor adding jobs faster than the regional average.", "Bothell", IMG("1601597111158-2fceff292cdc")],
    ],
  },
  "business-leaders": {
    name: "Business Leaders",
    split: [14, 3],
    items: [
      ["Skyline Analytics Co-Founder Named to National Tech Council", "A Seattle software co-founder was appointed to a national technology advisory council.", "Seattle", IMG("1483058712412-4245e9b90334")],
      ["Eastside Ventures Managing Partner Named Executive of the Year", "A Bellevue investment firm's managing partner won a regional executive honor.", "Bellevue", IMG("1507003211169-0a1dd7228f2d")],
      ["Spokane Valley Manufacturing CEO Joins State Trade Board", "A Spokane manufacturer's chief executive joined a statewide trade advisory board.", "Spokane", IMG("1519085360753-af0119f7cbe7")],
      ["Tideflats Robotics Founder Launches Second Startup", "A Tacoma robotics founder is launching a second company after an earlier exit.", "Tacoma", IMG("1519389950473-47ba0277781c")],
      ["Capitol Row Consulting Names New Managing Director", "An Olympia consulting firm named a new managing director to lead its next growth phase.", "Olympia", IMG("1521737604893-d14cc237f11d")],
      ["Redmond Cloud Systems Founder Named to Regional Innovation Board", "A Redmond software founder was appointed to a regional innovation advisory board.", "Redmond", IMG("1522071820081-009f0129c71c")],
      ["Port Gardner Logistics CEO Recognized for Workforce Growth", "An Everett logistics company's CEO was recognized for rapid local hiring.", "Everett", IMG("1531482615713-2afd69097998")],
      ["Columbia Gorge Ventures Co-Founder Named Small Business Leader", "A Vancouver investment firm's co-founder won a statewide small-business leadership honor.", "Vancouver", IMG("1542744173-8e7e53415bb0")],
      ["Waterfront Software Group Names New Chief Operating Officer", "A Kirkland software company named a new chief operating officer to lead operations.", "Kirkland", IMG("1551836022-d5d88e9218df")],
      ["Bay Trail Outfitters Founder Named to National Retail Board", "A Bellingham outdoor retailer's founder joined a national retail advisory board.", "Bellingham", IMG("1556742049-0cfed4f6a45d")],
      ["Cedar River Manufacturing Names New Board Chair", "A Renton manufacturer named a new board chair to guide its next expansion phase.", "Renton", IMG("1556761175-5973dc0f32e7")],
      ["Valley Bloom Agritech Founder Named Small Business Person of the Year", "A Yakima agricultural technology founder won a statewide small-business honor.", "Yakima", IMG("1560250097-0b93528c311a")],
      ["Blue Mountain Vintners Founder Joins State Tourism Board", "A Walla Walla winery founder joined a statewide tourism advisory board.", "Walla Walla", IMG("1560472355-536de3962603")],
      ["Orchard Valley Robotics Co-Founder Named to Manufacturing Council", "A Wenatchee robotics co-founder was appointed to a state manufacturing council.", "Wenatchee", IMG("1568992687947-868a62a9f521")],
      ["Foothills Data Systems Founder Launches Second Venture", "An Issaquah data systems founder is launching a second company after an early exit.", "Issaquah", IMG("1573164713988-8665fc963095")],
      ["Rainier Valley Freight Group Names New Chief Executive", "A Puyallup freight company named a new chief executive to lead its next growth phase.", "Puyallup", IMG("1573496359142-b8d87734a5a2")],
      ["North Creek Biotech Founder Named to State Innovation Council", "A Bothell biotech founder was appointed to a statewide innovation advisory council.", "Bothell", IMG("1573497019940-1c28c88b4f3e")],
    ],
  },
  education: {
    name: "Education",
    split: [14, 3],
    items: [
      ["Emerald City School District Breaks Ground on New STEM Wing", "A Seattle-area school district broke ground on a new wing dedicated to STEM education.", "Seattle", IMG("1427504494785-3a9ca7044f45")],
      ["Lakeview College Expands Online Degree Programs", "A Bellevue college is expanding its slate of online degree offerings for working students.", "Bellevue", IMG("1497633762265-9d179a990aa6")],
      ["Riverfront Community College Wins State Literacy Grant", "A Spokane community college was awarded a statewide grant to fund new literacy programs.", "Spokane", IMG("1503676260728-1c00da094a0b")],
      ["Tacoma Sound School District Opens Third New Elementary School", "A Tacoma-area district opened a third new elementary campus to keep pace with growth.", "Tacoma", IMG("1509062522246-3755977927d7")],
      ["Capitol Region College Expands Nursing Program Capacity", "An Olympia college is adding seats to its high-demand nursing program.", "Olympia", IMG("1523240795612-9a054b0db644")],
      ["Redmond Ridge School District Adds Coding Curriculum Districtwide", "A Redmond-area district is rolling out a new coding curriculum across all grade levels.", "Redmond", IMG("1523580494863-6f3031224c94")],
      ["Port Gardner College Expands Manufacturing Technology Lab", "An Everett college expanded its manufacturing technology lab to serve more students.", "Everett", IMG("1524178232363-1fb2b075b655")],
      ["Columbia Valley School District Wins State Arts Funding", "A Vancouver-area district was awarded statewide funding to expand its arts programming.", "Vancouver", IMG("1541178735493-479c1a27ed24")],
      ["Waterfront Academy Expands Early Learning Program", "A Kirkland school expanded its early learning program to serve more families.", "Kirkland", IMG("1541339907198-e08756dedf3f")],
      ["Bay Trail University Expands Marine Sciences Program", "A Bellingham university is expanding its marine sciences program with new lab space.", "Bellingham", IMG("1546410531-bb4caa6b424d")],
      ["Cedar River School District Breaks Ground on New Athletic Complex", "A Renton-area district broke ground on a new athletic complex serving three campuses.", "Renton", IMG("1568792923760-d70635a89fdc")],
      ["Yakima Valley College Expands Agriculture Technology Program", "A Yakima college expanded its agriculture technology program with new equipment.", "Yakima", IMG("1571260899304-425eee4c7efc")],
      ["Blue Mountain College Adds Viticulture Degree Track", "A Walla Walla college launched a new degree track focused on viticulture.", "Walla Walla", IMG("1580537659466-0a9bfa916a54")],
      ["Orchard Valley College Expands Rural Health Training", "A Wenatchee college expanded its training programs for rural health careers.", "Wenatchee", IMG("1580582932707-520aed937b7b")],
      ["Cascade Foothills School District Wins State Literacy Grant", "An Issaquah-area district was awarded a statewide grant to fund new literacy programs.", "Issaquah", IMG("1588072432836-e10032774350")],
      ["Rainier Valley College Expands Trades Apprenticeship Program", "A Puyallup college expanded its apprenticeship program for skilled trades.", "Puyallup", IMG("1592280771190-3e2e4d571952")],
      ["North Creek School District Opens New Career Technical Center", "A Bothell-area district opened a new career and technical education center.", "Bothell", IMG("1602052577122-f73b9710adba")],
    ],
  },
  healthcare: {
    name: "Healthcare",
    split: [14, 3],
    items: [
      ["Puget Harbor Medical Center Opens New Outpatient Surgery Center", "A Seattle hospital opened a new outpatient surgery center to expand capacity.", "Seattle", IMG("1471864190281-a93a3070b6de")],
      ["Eastside Regional Health Opens New Diabetes Clinic", "A Bellevue health system opened a new clinic focused on diabetes care and prevention.", "Bellevue", IMG("1505751172876-fa1923c5c528")],
      ["Spokane Valley Medical Center Expands Rural Clinic Network", "A Spokane health system is expanding its network of rural clinics across the region.", "Spokane", IMG("1512678080530-7760d81faba6")],
      ["Tacoma Sound Health Adds New Pediatric Wing", "A Tacoma hospital opened a new wing dedicated to pediatric care.", "Tacoma", IMG("1516549655169-df83a0774514")],
      ["Capitol Region Hospital Expands Behavioral Health Services", "An Olympia hospital expanded its behavioral health program to serve more patients.", "Olympia", IMG("1516574187841-cb9cc2ca948b")],
      ["Redmond Ridge Clinic Opens New Urgent Care Facility", "A Redmond clinic network opened a new urgent care facility for faster patient access.", "Redmond", IMG("1519494026892-80bbd2d6fd0d")],
      ["Port Gardner Health Expands Cardiac Care Program", "An Everett health system expanded its cardiac care program with new specialists.", "Everett", IMG("1538108149393-fbbd81895907")],
      ["Columbia Valley Medical Group Opens Second Outpatient Suite", "A Vancouver medical group opened a second outpatient suite to meet growing demand.", "Vancouver", IMG("1550831107-1553da8c8464")],
      ["Waterfront Health Partners Adds Telehealth Program", "A Kirkland health network launched a new telehealth program for remote patients.", "Kirkland", IMG("1551190822-a9333d879b1f")],
      ["Bay Trail Medical Center Expands Maternity Ward", "A Bellingham hospital expanded its maternity ward to add bed capacity.", "Bellingham", IMG("1559839734-2b71ea197ec2")],
      ["Cedar River Health Opens New Physical Therapy Clinic", "A Renton health group opened a new clinic dedicated to physical therapy services.", "Renton", IMG("1579684385127-1ef15d508118")],
      ["Yakima Valley Medical Center Expands Rural Outreach Program", "A Yakima hospital expanded its outreach program to reach outlying farm communities.", "Yakima", IMG("1580281657702-257584239a55")],
      ["Blue Mountain Health Adds New Oncology Unit", "A Walla Walla hospital opened a new unit dedicated to cancer treatment and support.", "Walla Walla", IMG("1584515933487-779824d29309")],
      ["Orchard Valley Hospital Expands Rural Clinic Network", "A Wenatchee hospital is expanding its network of rural clinics across the valley.", "Wenatchee", IMG("1584982751601-97dcc096659c")],
      ["Cascade Foothills Clinic Opens New Imaging Center", "An Issaquah clinic opened a new imaging center to reduce patient wait times.", "Issaquah", IMG("1587351021355-a479a299d2f9")],
      ["Rainier Valley Medical Center Adds New Surgical Wing", "A Puyallup hospital opened a new wing dedicated to surgical services.", "Puyallup", IMG("1587560699334-cc4ff634909a")],
      ["North Creek Health Opens New Diabetes and Nutrition Clinic", "A Bothell health group opened a new clinic focused on diabetes and nutrition care.", "Bothell", IMG("1600959907703-125ba1374a12")],
    ],
  },
};

const onlyCategory = process.argv[2];

let totalWritten = 0;
const usedSlugs = new Set();
let globalIndex = 0;

for (const [categorySlug, cat] of Object.entries(CATEGORY_DATA)) {
  if (onlyCategory && categorySlug !== onlyCategory) {
    globalIndex += cat.items.length;
    continue;
  }

  const dates = genDates(cat.split[0], cat.split[1]);
  let written = 0;

  cat.items.forEach(([title, excerpt, city, coverImage], i) => {
    const date = dates[i];
    const seed = globalIndex;

    let slug = slugify(`${city}-${title}`);
    if (usedSlugs.has(slug)) slug = `${slug}-${seed}`;
    usedSlugs.add(slug);

    const body = buildBody(categorySlug, city, seed);
    const featured = categorySlug === "finance-economy" && i === 0;

    const frontmatter = [
      "---",
      `title: ${JSON.stringify(title)}`,
      `slug: ${JSON.stringify(slug)}`,
      `excerpt: ${JSON.stringify(excerpt)}`,
      `category: ${JSON.stringify(categorySlug)}`,
      `date: ${JSON.stringify(date)}`,
      `coverImage: ${JSON.stringify(coverImage)}`,
      ...(featured ? [`featured: true`] : []),
      `imageCredit: ${JSON.stringify(CREDIT)}`,
      "---",
      "",
    ].join("\n");

    fs.writeFileSync(path.join(OUT_DIR, `${slug}.md`), frontmatter + body + "\n");
    written++;
    totalWritten++;
    globalIndex++;
  });

  console.log(`[${cat.name}] wrote ${written} articles`);
}

console.log(`Done. ${totalWritten} articles written to content/articles/`);
