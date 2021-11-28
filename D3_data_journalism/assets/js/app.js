var svgWidth = 1200;
var svgHeight = 800;
// var svgWidth = 3000;
// var svgHeight = 5000;

var margin = {
  top: 20,
  right: 20,
  bottom: 60,
  left: 60
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv").then(function(stateData) {
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    stateData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
      });
    
    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(stateData, d => d.poverty) + 2])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([4, d3.max(stateData, d => d.healthcare) + 2])
      .range([height, 0]);
      

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "#03a5fc")
    .attr("opacity", "1")
    .style("stroke", "white");

    // Add label to each circle
    chartGroup.selectAll("textCircle")
    .data(stateData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .text(d => d.abbr)
    .style("text-anchor", "middle")
    .style("fill", "white")
    .style("font-family", "Arial")
    .style("font-weight", "bold")
    .style("font-size", "14px");


    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 1.75))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lack of Healthcare (%)")
      .style("font-weight", "bold");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 1.85}, ${height + margin.top + 20})`)
      .attr("class", "axisText")
      .text("In Poverty (%)")
      .style("font-weight", "bold");
}).catch(function(error) {
    console.log(error);
  });
