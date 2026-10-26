"use strict";

// Run with NODE_PATH pointing to the bundled workspace node_modules.
const fs = require("node:fs");
const path = require("node:path");
const { instance } = require("@viz-js/viz");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const specs = [
  { language: "python", source: "backend/src/infrastructure/data/pythonSkillGraph.json" },
  { language: "javascript", source: "ai-service/data/javascriptSkillGraph.json" },
  { language: "cpp", source: "curriculum/cppSkillGraph.json" },
];

function quote(value) {
  return JSON.stringify(String(value));
}

function rowsFor(graph) {
  const skills = graph.skills.map((skill) => skill.id);
  const order = new Map(skills.map((id, index) => [id, index]));
  const next = new Map(skills.map((id) => [id, []]));
  const degree = new Map(skills.map((id) => [id, 0]));
  const depth = new Map(skills.map((id) => [id, 0]));
  for (const edge of graph.edges) {
    if (!next.has(edge.source) || !next.has(edge.target)) {
      throw new Error(`Unknown edge endpoint: ${edge.source} -> ${edge.target}`);
    }
    next.get(edge.source).push(edge.target);
    degree.set(edge.target, degree.get(edge.target) + 1);
  }
  const queue = skills.filter((id) => degree.get(id) === 0);
  let visited = 0;
  while (queue.length) {
    queue.sort((a, b) => order.get(a) - order.get(b));
    const source = queue.shift();
    visited += 1;
    for (const target of next.get(source)) {
      depth.set(target, Math.max(depth.get(target), depth.get(source) + 1));
      degree.set(target, degree.get(target) - 1);
      if (degree.get(target) === 0) queue.push(target);
    }
  }
  if (visited !== skills.length) throw new Error("Skill graph contains a cycle");
  const byDepth = new Map();
  for (const id of skills) {
    const level = depth.get(id);
    if (!byDepth.has(level)) byDepth.set(level, []);
    byDepth.get(level).push(id);
  }
  const rows = [];
  for (const level of [...byDepth.keys()].sort((a, b) => a - b)) {
    const group = byDepth.get(level);
    for (let index = 0; index < group.length; index += 4) {
      rows.push(group.slice(index, index + 4));
    }
  }
  return rows;
}

function dotFor(graph) {
  const rows = rowsFor(graph);
  const lines = [
    "digraph Skills {",
    'graph [rankdir=TB, bgcolor="white", pad="0.18", nodesep="0.16", ranksep="0.42", splines=polyline, outputorder=edgesfirst, newrank=true];',
    'node [shape=box, style="rounded,filled", fixedsize=false, width="1.52", height="0.36", margin="0.06,0.04", fontname="Arial", fontsize="11", fontcolor="#17324e", color="#3b8b83", fillcolor="#e0f4ee", penwidth="1.05"];',
    'edge [color="#8799ab", penwidth="0.88", arrowsize="0.43"];',
  ];
  for (const skill of graph.skills) {
    const planned = skill.content_status === "PLANNED";
    const fill = planned ? "#eef0f5" : "#e0f4ee";
    const border = planned ? "#879eb3" : "#3b8b83";
    lines.push(`${quote(skill.id)} [fillcolor="${fill}", color="${border}"];`);
  }
  for (const row of rows) {
    lines.push(`{ rank=same; ${row.map(quote).join("; ")}; }`);
    for (let i = 0; i + 1 < row.length; i += 1) {
      lines.push(`${quote(row[i])} -> ${quote(row[i + 1])} [style=invis, constraint=false, weight=100];`);
    }
  }
  // These edges keep consecutive visual rows ordered even when no true edge links them.
  for (let i = 0; i + 1 < rows.length; i += 1) {
    lines.push(`${quote(rows[i][0])} -> ${quote(rows[i + 1][0])} [style=invis, weight=100];`);
  }
  for (const edge of graph.edges) {
    lines.push(`${quote(edge.source)} -> ${quote(edge.target)};`);
  }
  lines.push("}");
  return { dot: lines.join("\n"), rows };
}

async function main() {
  const viz = await instance();
  for (const spec of specs) {
    const graph = JSON.parse(fs.readFileSync(path.join(root, spec.source), "utf8"));
    const { dot, rows } = dotFor(graph);
    const svg = viz.renderString(dot, { engine: "dot", format: "svg" });
    const renderedNodes = (svg.match(/class="node"/g) || []).length;
    if (renderedNodes !== graph.skills.length) {
      throw new Error(`${spec.language}: rendered ${renderedNodes}/${graph.skills.length} nodes`);
    }
    const target = path.join(root, "assets/bao_cao", `do_thi_tri_thuc_${spec.language}.png`);
    await sharp(Buffer.from(svg), { density: 240 }).resize({ width: 2400, withoutEnlargement: true }).png().toFile(target);
    console.log(`${spec.language}: ${graph.skills.length} nodes, ${graph.edges.length} edges, ${rows.length} display rows -> ${target}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
