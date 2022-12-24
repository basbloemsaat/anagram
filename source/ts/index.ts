import "../css/main.scss";
import * as d3 from "d3";

function LOADED() {
  const svg = d3.select("svg");

  let width = parseInt(svg.style("width"));
  let height = parseInt(svg.style("height"));

  let rcircle = 30; //fixed val good enough for my use

  const scaleLin = d3.scaleLinear().range([rcircle, width - rcircle]);
  const g = svg
    .append("g")
    .classed("graph", true)
    .attr("transform", "translate(0,200)");

  interface Node {
    letter: string;
    id: number;
    end?: boolean;
  }
  interface Chain {
    nodes: Node[];
  }

  let graph: Chain;

  function textToGraph(t: string): Chain {
    const text_array = t.split("");
    const graph: Chain = {
      nodes: text_array.map((e: string, i: number) => {
        return { letter: e, id: i, fy: 0 };
      }),
    };

    let x = Array.from(Array(graph.nodes.length).keys()).map((d) => "" + d);
    scaleLin.domain([0, graph.nodes.length - 1]);
    let mid = width / 2;
    let left = mid - (graph.nodes.length / 2) * (rcircle * 2);
    let right = mid + (graph.nodes.length / 2) * (rcircle * 2);
    scaleLin.range([
      clamp(left, 0 + rcircle, width - rcircle),
      clamp(right, 0 + rcircle, width - rcircle),
    ]);
    return graph;
  }

  function shuffle(array: Node[]) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  function randomizeNodes() {
    shuffle(graph.nodes);
    reidNodes(graph);
    g.selectAll("g.node")
      .transition()
      .duration(200)
      .attr("transform", (d: Node) => `translate(${scaleLin(d.id)},0)`);
  }

  function reidNodes(graph: Chain): void {
    graph.nodes.forEach((e, i) => {
      e.id = i;
    });
  }

  function clamp(x: number, lo: number, hi: number) {
    return x < lo ? lo : x > hi ? hi : x;
  }

  let dragnode: Node;

  function dragstart(event: MouseEvent, d: Node) {
    dragnode = graph.nodes[d.id];
  }

  function dragged(event: MouseEvent, d: Node) {
    let x = clamp(event.x, 0, width);
    d3.select(this).attr("transform", (d) => `translate(${event.x},0)`);

    let new_id = Math.round(scaleLin.invert(x));

    if (new_id != d.id) {
      let oldpos = d.id;
      let node = graph.nodes[oldpos];

      let newpos = new_id;
      graph.nodes.splice(oldpos, 1);
      graph.nodes.splice(newpos, 0, node);
      reidNodes(graph);
      g.selectAll("g.node")
        .filter((d: Node) => d.id != node.id)
        .transition()
        .duration(200)
        .attr("transform", (d: Node) => `translate(${scaleLin(d.id)},0)`);

      // .attr("cx", (d: Node, i) => scaleLin(d.id));
    }
  }

  function dragend(event: MouseEvent, d: Node) {
    g.selectAll("g.node").attr(
      "transform",
      (d: Node) => `translate(${scaleLin(d.id)},0)`
    );
  }

  const drag = d3
    .drag()
    .on("start", dragstart)
    .on("drag", dragged)
    .on("end", dragend);

  const redraw = () => {
    // @ts-expect-error
    graph = textToGraph(d3.select("input").node().value);

    const node = g
      .selectAll("g.node")
      .data(graph.nodes)
      .join("g")
      .classed("node", true)
      .classed("end", (d: Node) => !!d.end)
      .attr("transform", (d) => `translate(${scaleLin(d.id)},0)`);

    node.append("circle").attr("r", rcircle).classed("backg", true);

    node.append("text").text((d) => d.letter);

    node.append("circle").attr("r", rcircle).classed("overlay", true);

    g.selectAll(".node").call(drag);
  };

  redraw();

  d3.select("input").on("keyup", () => {
    redraw();
  });

  d3.select("button#randomizer").on("click", (e: Event) => {
    randomizeNodes();
    e.preventDefault();
    return false;
  });
}

window.onload = () => {
  console.log("ONLOAD");
  LOADED();
};
