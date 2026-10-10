import * as THREE from "three";

export type LayerKind = "interface" | "admin" | "data";

const W = 1600;
const H = 1000;
const ink = "#171c25";
const blue = "#254bff";
const muted = "#79828f";
const paper = "#f7f8fb";

function round(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fill: string | CanvasGradient,
) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.fill();
}

function text(
  ctx: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  size = 24,
  color = ink,
  weight = 500,
  mono = false,
) {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px ${mono ? '"Courier New", monospace' : "Arial, sans-serif"}`;
  ctx.fillText(value, x, y);
}

function line(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color = "#e7eaf0",
  width = 2,
) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function dot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function browser(ctx: CanvasRenderingContext2D, kind: LayerKind) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);
  round(ctx, 0, 0, W, 76, 0, "#f1f3f6");
  ["#edaca1", "#e5c888", "#a2cdb7"].forEach((color, i) =>
    dot(ctx, 41 + i * 25, 38, 7, color),
  );
  round(ctx, 478, 19, 644, 38, 10, "#ffffff");
  text(
    ctx,
    `portfolio / ${kind === "interface" ? "interface" : kind === "admin" ? "operations" : "architecture"}`,
    618,
    45,
    18,
    muted,
    500,
    true,
  );
  text(ctx, "CONCEPT", 1455, 46, 15, muted, 600, true);
}

function interfacePanel(ctx: CanvasRenderingContext2D) {
  browser(ctx, "interface");
  dot(ctx, 89, 133, 20, blue);
  text(ctx, "S", 81, 142, 23, "#ffffff", 700);
  text(ctx, "SKY / SERVICE", 127, 143, 29, ink, 700);
  text(ctx, "SERVICES", 930, 141, 19, muted, 600);
  text(ctx, "EXPERIENCE", 1080, 141, 19, muted, 600);
  round(ctx, 1304, 107, 208, 53, 27, ink);
  text(ctx, "LET'S TRAVEL", 1341, 140, 17, "#ffffff", 700);
  line(ctx, 65, 188, 1535, 188);

  text(ctx, "A BETTER WAY TO ARRIVE", 79, 279, 19, blue, 700, true);
  text(ctx, "Arrive with", 75, 384, 91, ink, 700);
  text(ctx, "confidence.", 75, 486, 91, ink, 700);
  text(ctx, "Thoughtful airport services.", 81, 557, 29, muted, 400);
  text(ctx, "A smooth journey, from the first step.", 81, 603, 27, muted, 400);
  round(ctx, 81, 651, 316, 69, 35, blue);
  text(ctx, "EXPLORE SERVICES", 118, 694, 20, "#ffffff", 700);
  text(ctx, "↗", 355, 697, 28, "#ffffff", 500);

  round(ctx, 888, 242, 628, 496, 38, "#e9edff");
  const gradient = ctx.createLinearGradient(921, 268, 1462, 718);
  gradient.addColorStop(0, "#315eff");
  gradient.addColorStop(1, "#172aa4");
  round(ctx, 918, 270, 568, 434, 28, gradient);
  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.ellipse(1220, 508, 105 + i * 48, 80 + i * 35, -0.6, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.save();
  ctx.translate(1220, 461);
  ctx.rotate(-0.3);
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(-156, 4);
  ctx.lineTo(165, -82);
  ctx.lineTo(84, 112);
  ctx.lineTo(16, 52);
  ctx.lineTo(-59, 103);
  ctx.lineTo(-44, 37);
  ctx.closePath();
  ctx.fill();
  line(ctx, -44, 37, 165, -82, "#cbd5ff", 3);
  ctx.restore();
  text(ctx, "YOUR JOURNEY, SIMPLIFIED.", 956, 666, 19, "#ffffff", 600, true);
  text(ctx, "01 / 03", 1370, 666, 18, "#bdc8ff", 500, true);

  [
    ["01", "Fast track", "Make every minute count."],
    ["02", "Airport transfer", "The next leg, taken care of."],
    ["03", "Meet & greet", "A warm welcome awaits."],
  ].forEach(([number, title, subtitle], i) => {
    const x = 81 + i * 492;
    round(ctx, x, 795, 466, 147, 20, paper);
    text(ctx, number, x + 27, 837, 19, blue, 600, true);
    text(ctx, title, x + 27, 883, 32, ink, 600);
    text(ctx, subtitle, x + 27, 916, 20, muted, 400);
    text(ctx, "↗", x + 414, 845, 29, muted, 400);
  });
}

function adminPanel(ctx: CanvasRenderingContext2D) {
  browser(ctx, "admin");
  round(ctx, 0, 76, 290, 924, 0, "#f7f8fb");
  text(ctx, "CONTROL ROOM", 39, 151, 26, ink, 700);
  text(ctx, "OPERATIONS / DEMO", 40, 183, 16, muted, 500, true);
  ["Overview", "Requests", "Customers", "Reports", "Settings"].forEach(
    (item, i) => {
      const y = 260 + i * 79;
      if (i === 1) round(ctx, 22, y - 37, 245, 58, 12, "#e7ecff");
      round(ctx, 42, y - 18, 17, 17, 4, i === 1 ? blue : "#c4cad3");
      text(ctx, item, 80, y, 24, i === 1 ? blue : muted, i === 1 ? 700 : 500);
    },
  );
  round(ctx, 32, 851, 225, 103, 16, "#ffffff");
  dot(ctx, 66, 896, 9, "#3a9d75");
  text(ctx, "Workspace online", 87, 903, 18, ink, 600);
  text(ctx, "Illustrative sample", 49, 935, 16, muted, 400);

  text(ctx, "Service requests", 343, 152, 42, ink, 700);
  text(ctx, "A clear view of day-to-day operations.", 346, 192, 24, muted, 400);
  round(ctx, 1328, 113, 197, 60, 12, blue);
  text(ctx, "+ New request", 1358, 151, 21, "#ffffff", 600);
  [
    ["ACTIVE REQUESTS", "24", "+ 4 this week"],
    ["IN PROGRESS", "08", "Across all services"],
    ["COMPLETED", "16", "Sample workspace"],
  ].forEach(([title, value, subtitle], i) => {
    const x = 345 + i * 398;
    round(ctx, x, 244, 375, 183, 19, paper);
    text(ctx, title, x + 26, 287, 17, muted, 600, true);
    text(ctx, value, x + 26, 358, 64, ink, 600);
    text(ctx, subtitle, x + 26, 399, 19, i === 0 ? blue : muted, 500);
  });
  text(ctx, "Recent requests", 345, 496, 29, ink, 600);
  round(ctx, 1212, 458, 312, 53, 11, paper);
  text(ctx, "Search requests...", 1237, 492, 20, muted, 400);
  round(ctx, 345, 546, 1182, 54, 8, "#f0f2f7");
  ["REQUEST", "SERVICE", "STATUS", "ASSIGNED TO"].forEach((title, i) =>
    text(ctx, title, 367 + i * 285, 580, 17, muted, 600, true),
  );
  [
    ["DEMO-0042", "Airport transfer", "In progress", "Team A"],
    ["DEMO-0041", "Fast track", "Completed", "Team B"],
    ["DEMO-0040", "Meet & greet", "Pending", "Team A"],
    ["DEMO-0039", "Fast track", "Completed", "Team B"],
  ].forEach(([id, service, status, assignee], i) => {
    const y = 655 + i * 82;
    text(ctx, id, 367, y, 21, ink, 600, true);
    text(ctx, service, 652, y, 22, ink, 400);
    const statusColor =
      status === "Completed"
        ? "#e1f2e9"
        : status === "Pending"
          ? "#f7eddb"
          : "#e7ecff";
    const labelColor =
      status === "Completed"
        ? "#327c5e"
        : status === "Pending"
          ? "#ad7d32"
          : blue;
    round(ctx, 934, y - 27, 180, 41, 21, statusColor);
    text(ctx, status, 956, y + 1, 18, labelColor, 600);
    text(ctx, assignee, 1220, y, 22, muted, 400);
    line(ctx, 345, y + 32, 1526, y + 32);
  });
}

function dataPanel(ctx: CanvasRenderingContext2D) {
  browser(ctx, "data");
  ctx.fillStyle = "#171d2c";
  ctx.fillRect(0, 76, W, 924);
  text(ctx, "BEHIND THE INTERFACE", 75, 154, 19, "#8296ff", 600, true);
  text(ctx, "A system that connects.", 72, 242, 67, "#f8f9ff", 700);
  text(
    ctx,
    "Architecture study / illustrative flow",
    76,
    289,
    24,
    "#929cad",
    400,
  );
  const nodes = [
    ["01", "INTERFACE", "User interaction"],
    ["02", "APPLICATION", "Business logic"],
    ["03", "DATA", "Persistent state"],
  ];
  nodes.forEach(([number, title, caption], i) => {
    const x = 76 + i * 504;
    round(ctx, x, 353, 440, 172, 20, i === 1 ? "#254bff" : "#242d40");
    text(
      ctx,
      number,
      x + 27,
      393,
      17,
      i === 1 ? "#c2cdff" : "#8296ff",
      500,
      true,
    );
    text(ctx, title, x + 27, 445, 31, "#ffffff", 700, true);
    text(ctx, caption, x + 27, 491, 23, i === 1 ? "#ccd5ff" : "#9ba6b9", 400);
    if (i < 2) {
      line(ctx, x + 452, 439, x + 488, 439, "#788ced", 3);
      line(ctx, x + 478, 431, x + 488, 439, "#788ced", 3);
      line(ctx, x + 478, 447, x + 488, 439, "#788ced", 3);
    }
  });
  round(ctx, 76, 570, 957, 340, 20, "#111725");
  text(ctx, "system.flow.ts", 109, 610, 20, "#7f899d", 500, true);
  line(ctx, 104, 635, 1002, 635, "#283247");
  [
    ["01", "const product = {", "#a7b7f3"],
    ["02", '  interface: "thoughtful",', "#c6d0ef"],
    ["03", '  operations: "connected",', "#c6d0ef"],
    ["04", '  architecture: "maintainable",', "#c6d0ef"],
    ["05", "};", "#a7b7f3"],
  ].forEach(([number, value, color], i) => {
    const y = 685 + i * 42;
    text(ctx, number, 109, y, 21, "#53617a", 400, true);
    text(ctx, value, 173, y, 26, color, 400, true);
  });
  text(ctx, "BUILD WITH INTENT", 1087, 625, 18, "#8296ff", 600, true);
  [
    "Understand the problem",
    "Connect the pieces",
    "Deliver the experience",
  ].forEach((value, i) => {
    dot(ctx, 1099, 689 + i * 74, 5, "#8296ff");
    text(ctx, value, 1121, 697 + i * 74, 24, "#dde3f1", 400);
  });
  text(ctx, "UI  /  OPERATIONS  /  SYSTEMS", 78, 957, 17, "#667692", 500, true);
}

export function createPanelTexture(kind: LayerKind) {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx)
    throw new Error("A 2D canvas is required to draw the portfolio scene.");
  if (kind === "interface") interfacePanel(ctx);
  else if (kind === "admin") adminPanel(ctx);
  else dataPanel(ctx);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}
