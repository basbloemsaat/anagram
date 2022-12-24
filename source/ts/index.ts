import "../css/main.scss";
import * as d3 from "d3";

const svg = d3.select("svg");

let width = parseInt(svg.style("width"));
let height = parseInt(svg.style("height"));
const scale = d3.scalePoint().range([0, width]).align(0.5);

interface GraphNode extends d3.SimulationNodeDatum {
  letter: string;
  id: number;
  fx?: number;
  fy?: number;
}
interface GraphEdge {
  source: GraphNode;
  target: GraphNode;
}

interface Graph {
  nodes: GraphNode[];
  links: GraphEdge[];
}

function textToGraph(t: string): Graph {
  const text_array = t.split("");
  // text_array.push(" ");
  // text_array.unshift(" ");
  const graph: Graph = {
    nodes: text_array.map((e: string, i: number) => {
      return { letter: e, id: i, fy: 0 };
    }),
    links: [],
  };

  graph.nodes.unshift({ letter: " ", id: -1, fx: 0, fy: 0 });
  graph.nodes.push({ letter: " ", id: 999, fx: 800, fy: 0 });

  let x = Array.from(Array(graph.nodes.length).keys()).map((d) => "" + d);
  scale.domain(x);

  graph.nodes.forEach((node, i) => {
    node.fx = scale("" + i);
    if (i < graph.nodes.length - 1) {
      graph.links.push({ source: graph.nodes[i], target: graph.nodes[i + 1] });
    }
  });

  return graph;
}

// @ts-expect-error
const graph = textToGraph(d3.select("textarea").node().value);

const g = svg
  .append("g")
  .classed("graph", true)
  .attr("transform", "translate(0,200)");

const link = g
  .selectAll(".link")
  .data(graph.links)
  .join("line")
  .classed("link", true);

const node = g
  .selectAll(".node")
  .data(graph.nodes)
  .join("circle")
  .attr("r", 5)
  .classed("node", true)
  .classed("fixed", (d) => d.fx !== undefined);

function ticked() {
  node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
  link
    .attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y);
}

const simulation = d3
  .forceSimulation(graph.nodes)
  .force("charge", d3.forceManyBody().strength(-1000))
  .force("link", d3.forceLink(graph.links).strength(1))
  .force("x", d3.forceX())
  .force("y", d3.forceY())
  .on("tick", ticked);

graph.nodes.forEach((node, i) => {
  if (node.id != -1 && node.id != 999) {
    node.fx = null;
  }
});
