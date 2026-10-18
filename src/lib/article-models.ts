import type { Locale } from "../i18n";

export type ModelKind = "bottleneck" | "delegation" | "staffing";

export function bottleneck(agents: number, reviewHours: number, minutesPerTask: number) {
  const generated = agents * 4;
  const reviewCapacity = reviewHours * 60 / minutesPerTask;
  const demand = 60;
  return { generated, reviewCapacity, demand, delivered: Math.min(generated, reviewCapacity, demand) };
}

export function delegation(transferred: number, support: number) {
  return { transferred, support, released: transferred - support };
}

export function staffing(demand: number, productivity: number) {
  return { demand, productivity, ratio: demand / productivity };
}

export const modelDefinitions = {
  bottleneck: {
    number: "01", title: "再加一个 Agent，还能多交付多少？",
    intro: "只增加 Agent 数量，看看有效交付会不会一直增长。",
    context: "固定：每个 Agent 每周提交 4 项任务，人工每周最多验收 20 项。",
    input: { name: "agents", label: "并行 Agent 数量", min: 1, max: 20, step: 1, value: 8, unit: "个" },
    formula: "有效交付量 = min（Agent 产出能力，人工验收能力，有价值的任务需求）",
    assumptions: "假设每个 Agent 每周可提交 4 项可比任务，有价值的需求为每周 60 项。人工每周投入 10 小时，每项验收 30 分钟，即最多验收 20 项；每项交付均需人工验收。未计返工、上下文切换与 Agent 相互干扰。",
    limit: "这是稳态容量示意，结果可以是非整数。曲线不表示排队时间，也不推算 Anthropic 报告中的 80% 等待时间。",
  },
  delegation: {
    number: "02", title: "委派任务，能释放多少高级工程师时间？",
    intro: "委派后需要花多少时间指导和把关？拖动滑块，看看还能释放多少时间。",
    context: "固定：同一批任务自己做，每周需要 12 小时。",
    input: { name: "support", label: "指导、复核与返工的总时间", min: 0, max: 24, step: 1, value: 5, unit: "小时 / 周" },
    formula: "释放的高级工程师时间 = 12 小时 − 指导、复核与返工的总时间",
    assumptions: "假设初级工程师借助 Agent 完成并验收了同一批任务，指导、复核与返工均由高级工程师承担，且三项时间互不重复。",
    limit: "只衡量高级工程师时间的变化，不等于团队总工时节省或招聘回报。薪酬、初级工程师投入、算力成本与释放时间的用途均未计入。",
  },
  staffing: {
    number: "03", title: "效率提高，为什么人数还可能增加？",
    intro: "效率已经提高到 3 倍。如果需求继续增长，需要的人会变多吗？",
    context: "固定：人均有效生产力为原来的 3 倍。",
    input: { name: "demand", label: "有价值的任务需求变为原来的", min: 0.5, max: 6, step: 0.1, value: 2, unit: "倍" },
    formula: "新人数 ÷ 原人数 = 需求增长倍数 ÷ 人均有效生产力增长倍数",
    assumptions: "假设工作量可比，质量标准不变，生产力已包含理解、验证与协作成本，并且人员能力与任务需求匹配。倍数表示变为原来的多少倍，不是增加了多少倍。",
    limit: "只表示总体所需人力的比例，未区分 A / B / C 任务、资历、预算与市场约束，也未计入人数取整和培养价值。不是招聘预测。",
  },
} as const;

const englishDefinitions = {
  bottleneck: {
    title: "Will another agent lead to more accepted work?",
    intro: "Increase only the number of agents. Does accepted output keep growing?",
    context: "Fixed: each agent submits 4 tasks per week; human reviewers can accept at most 20.",
    label: "Concurrent agents", unit: "agents",
    formula: "Accepted output = min(agent capacity, human review capacity, valuable task demand)",
    assumptions: "Assume 4 comparable tasks per agent-week and demand for 60 tasks per week. Human review has 10 hours per week at 30 minutes per task, so at most 20 tasks can be accepted. Every delivery requires human review. Rework, context switching and interference between agents are excluded.",
    limit: "This illustrates steady-state capacity, which may be fractional. It does not model queueing time or estimate the 80% waiting-time figure in Anthropic's report.",
  },
  delegation: {
    title: "How much senior engineering time does delegation free up?",
    intro: "How much guidance and review does delegation need? Move the slider to see the time released.",
    context: "Fixed: doing the same task basket personally takes 12 hours per week.",
    label: "Total guidance, review and rework", unit: "hours/week",
    formula: "Senior time released = 12 hours − total guidance, review and rework time",
    assumptions: "Assume a junior engineer, assisted by agents, completes and accepts the same task basket. A senior engineer provides the guidance, review and rework; these time categories do not overlap.",
    limit: "This measures the change in senior engineering time, not total team hours or hiring ROI. Pay, junior engineering time, compute costs and the eventual use of the released time are excluded.",
  },
  staffing: {
    title: "Why might higher productivity still require more people?",
    intro: "Productivity is already 3 times its original level. What happens if demand keeps growing?",
    context: "Fixed: effective output per person is 3 times its original level.",
    label: "Valuable task demand as a multiple of the original", unit: "times",
    formula: "New headcount / original headcount = demand multiplier / productivity multiplier",
    assumptions: "Assume comparable work and unchanged quality standards. Effective productivity includes understanding, verification and coordination costs, and people have the skills required by the tasks. A multiplier means the new level divided by the original level, not the increase alone.",
    limit: "This is an aggregate staffing equivalent. It does not distinguish A/B/C tasks, seniority, budgets or market constraints, or account for rounding and the value of training. It is not a hiring forecast.",
  },
} as const;

export function getModelDefinition(kind: ModelKind, lang: Locale = "zh-CN") {
  const base = modelDefinitions[kind];
  if (lang === "zh-CN") return base;
  const copy = englishDefinitions[kind];
  return { ...base, ...copy, input: { ...base.input, label: copy.label, unit: copy.unit } };
}

export const modelLabels = {
  "zh-CN": {
    experiment: "思想实验", illustrative: "假设参数 · 非实测数据", adjust: "调整模型参数",
    reset: "恢复默认", hint: "拖动滑块或使用方向键", result: "在这组假设下",
    chart: "图表，可横向滚动", scroll: "左右滑动可查看完整图表", current: "当前设定",
    delegation: "圆点与水平线的垂直距离，是释放或额外占用的时间。",
    staffing: "需求达到 3 倍时，所需人数回到原来的 100%。",
    assumptions: "公式与假设", noScript: "当前显示默认假设的结果。启用 JavaScript 后可调整参数；公式和适用边界仍可阅读。",
  },
  en: {
    experiment: "Thought experiment", illustrative: "Illustrative assumptions · not measured data", adjust: "Adjust the model",
    reset: "Reset", hint: "Drag or use arrow keys", result: "Under these assumptions",
    chart: "chart, scroll horizontally", scroll: "Scroll sideways to see the full chart", current: "Current setting",
    delegation: "The vertical gap between the dot and the horizontal line is time released or added.",
    staffing: "When demand reaches 3 times the original level, required headcount returns to 100%.",
    assumptions: "Formula and assumptions", noScript: "Default results are shown. Enable JavaScript to adjust the slider. The formula and limitations remain readable.",
  },
} as const;

export function formatNumber(value: number) {
  return new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 1 }).format(value);
}

export interface ChartLine { label: string; tone: string; points: [number, number][] }
export interface ModelView {
  value: string;
  unit: string;
  summary: string;
  detail: string;
  xMax: number;
  yMax: number;
  xLabel: string;
  yLabel: string;
  xTicks: number[];
  yTicks: number[];
  lines: ChartLine[];
  marker: [number, number];
}

function defaultModelView(kind: ModelKind, value: number): ModelView {
  if (kind === "bottleneck") {
    const result = bottleneck(value, 10, 30);
    const maximum = Math.max(80, result.reviewCapacity);
    const constraints = [
      [result.generated, "Agent 产出"], [result.reviewCapacity, "人工验收"], [result.demand, "有效需求"],
    ] as const;
    const limiting = constraints.filter(([capacity]) => Math.abs(capacity - result.delivered) < 1e-8).map(([, label]) => label);
    return {
      value: formatNumber(result.delivered), unit: "项 / 周 · 有效交付",
      summary: `当前瓶颈：${limiting.join("与")}。`,
      detail: `Agent 可提交 ${formatNumber(result.generated)} 项，人工可验收 ${formatNumber(result.reviewCapacity)} 项，有效需求为 60 项 / 周。`,
      xMax: 20, yMax: maximum, xLabel: "并行 Agent / 个", yLabel: "任务 / 周",
      xTicks: [0, 5, 10, 15, 20], yTicks: [0, maximum / 2, maximum],
      lines: [
        { label: "Agent 可提交", tone: "potential", points: [[0, 0], [20, 80]] },
        { label: "有效交付", tone: "primary", points: [[0, 0], [Math.min(result.reviewCapacity, result.demand) / 4, Math.min(result.reviewCapacity, result.demand)], [20, Math.min(result.reviewCapacity, result.demand)]] },
      ],
      marker: [value, result.delivered],
    };
  }
  if (kind === "delegation") {
    const result = delegation(12, value);
    const maximum = 24;
    const spent = value;
    return {
      value: `${result.released > 0 ? "+" : ""}${formatNumber(result.released)}`, unit: "小时 / 周 · 高级工程师时间",
      summary: result.released > 0 ? "释放了时间，可投入其他工作。" : result.released < 0 ? "指导和返工超过原投入，反而占用更多时间。" : "收支相抵，没有释放高级工程师时间。",
      detail: `12 小时原投入 − ${formatNumber(value)} 小时指导、复核与返工 = ${formatNumber(result.released)} 小时。`,
      xMax: maximum, yMax: maximum, xLabel: "指导 + 复核与返工 / 小时", yLabel: "高级工程师投入 / 小时",
      xTicks: [0, 6, 12, 18, 24], yTicks: [0, 12, 24],
      lines: [
        { label: "委派前投入", tone: "human", points: [[0, 12], [maximum, 12]] },
        { label: "委派后投入", tone: "primary", points: [[0, 0], [maximum, maximum]] },
      ],
      marker: [spent, spent],
    };
  }
  const result = staffing(value, 3);
  return {
    value: `${formatNumber(result.ratio * 100)}%`, unit: "相对于原人数 · 所需人力",
    summary: Math.abs(value - 3) < 1e-8 ? "需求与效率同比例增长，所需人力不变。" : value > 3 ? "需求增长更快，所需人力增加。" : "效率增长更快，所需人力减少。",
    detail: `${formatNumber(value)} ÷ 3 ≈ ${formatNumber(result.ratio * 100)}%；原来每 100 人对应约 ${formatNumber(result.ratio * 100)} 人。`,
    xMax: 6, yMax: 200, xLabel: "有效任务需求 / 原来的倍数", yLabel: "所需人数 / 原人数的 %",
    xTicks: [0, 1, 2, 3, 4, 5, 6], yTicks: [0, 100, 200],
    lines: [
      { label: "原人数：100%", tone: "human", points: [[0, 100], [6, 100]] },
      { label: "所需人数", tone: "primary", points: [[0, 0], [6, 200]] },
    ],
    marker: [value, result.ratio * 100],
  };
}

export function modelView(kind: ModelKind, value: number, lang: Locale = "zh-CN"): ModelView {
  const view = defaultModelView(kind, value);
  if (lang === "zh-CN") return view;
  if (kind === "bottleneck") {
    const result = bottleneck(value, 10, 30);
    return {
      ...view, unit: "accepted tasks / week",
      summary: result.generated < result.reviewCapacity ? "Agent output is the bottleneck." : result.generated === result.reviewCapacity ? "Agent output and human review are both at capacity." : "Human review is the bottleneck.",
      detail: `Agents can submit ${formatNumber(result.generated)} tasks, humans can review 20, and valuable demand is 60 tasks per week.`,
      xLabel: "Concurrent agents", yLabel: "Tasks / week",
      lines: view.lines.map((line) => ({ ...line, label: line.tone === "potential" ? "Agent submissions" : "Accepted output" })),
    };
  }
  if (kind === "delegation") {
    const { released } = delegation(12, value);
    return {
      ...view, unit: "hours / week · change in senior time available",
      summary: released > 0 ? "Time is released for other work." : released < 0 ? "Guidance and rework exceed the original effort, using more senior time." : "Break-even: no senior engineering time is released.",
      detail: `12 original hours − ${formatNumber(value)} hours of guidance, review and rework = ${formatNumber(released)} hours released.`,
      xLabel: "Guidance, review and rework / hours", yLabel: "Senior effort / hours",
      lines: view.lines.map((line) => ({ ...line, label: line.tone === "human" ? "Before delegation" : "After delegation" })),
    };
  }
  const percent = formatNumber(staffing(value, 3).ratio * 100);
  return {
    ...view, unit: "required headcount / original headcount",
    summary: Math.abs(value - 3) < 1e-8 ? "Demand and productivity grow equally; required headcount is unchanged." : value > 3 ? "Demand grows faster; required headcount rises." : "Productivity grows faster; required headcount falls.",
    detail: `${formatNumber(value)} / 3 ≈ ${percent}%. Each original 100 people corresponds to about ${percent} people.`,
    xLabel: "Valuable task demand / original level", yLabel: "Required headcount / % of original",
    lines: view.lines.map((line) => ({ ...line, label: line.tone === "human" ? "Original headcount: 100%" : "Required headcount" })),
  };
}

export const chart = { width: 600, height: 310, left: 52, right: 20, top: 30, bottom: 58 };
export function plotPoint(x: number, y: number, view: ModelView): [number, number] {
  return [
    chart.left + x / view.xMax * (chart.width - chart.left - chart.right),
    chart.height - chart.bottom - y / view.yMax * (chart.height - chart.top - chart.bottom),
  ];
}
export function linePoints(line: ChartLine, view: ModelView) {
  return line.points.map(([x, y]) => plotPoint(x, y, view).join(",")).join(" ");
}
