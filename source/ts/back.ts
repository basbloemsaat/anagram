import "../css/main.scss";
import * as d3 from "d3";

const svg = d3.select("svg");

let width = parseInt(svg.style("width"));
const scale = d3.scaleBand().range([0, width]).align(0.5).paddingInner(0.2);

const drag_start = function (event: Event) {
  console.log("drag_start", event);
};

//@ts-expect-erro r
// d3.DragEvent not in types
const drag_drag = function (event: any, d: any) {
  console.log("drag_drag", event, d, this);
  //   console.log(event);
  this.attr("x", 100);
};
const drag_end = function (event: Event, d: any) {
  console.log("drag_end", event);
};
let dragging = null;

const drawletters = function (t: string) {
  const text_array = t.split("");
  let x = Array.from(Array(text_array.length).keys()).map((d) => "" + d);

  scale.domain(x);
  let bw = scale.bandwidth();

  const letters = svg
    .selectAll("g.letter")
    .data(text_array)
    .join("g")
    .classed("letter", true)
    .attr("transform", (d, i) => {
      return `translate(${scale("" + i)},50)`;
    });

  letters
    .append("rect")
    .attr("width", bw)
    .attr("height", bw)
    .classed("bg", true);
  letters
    .append("text")
    .attr("x", bw / 2)
    .attr("y", bw / 2)
    .text((d) => d);
  letters
    .append("rect")
    .attr("width", bw)
    .attr("height", bw)
    .classed("dragt", true);

  letters.selectAll("rect.dragt").call(
    d3
      .drag()
      .subject((d) => {
        console.log(d);
        console.log(this);
        return d;
      })
      .on("start", drag_start)
      .on("drag", drag_drag)
      .on("end", drag_end)
  );
};

// @ts-expect-error
let text = d3.select("textarea").node().value;
drawletters(text);
