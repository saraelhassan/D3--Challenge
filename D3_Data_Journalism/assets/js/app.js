// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 700;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
var svgscales = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chart = svgscales.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv").then(function (PHData) {
    console.log(PHData);
    // poverty and healthcare data
    PHData.forEach(function (data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    // x/y scales

    var xscale = d3.scaleLinear()
        .domain([0, d3.max(PHData, d => d.poverty)])
        .range([0, width]);


    var yscale = d3.scaleLinear()
        .domain([0, d3.max(PHData, d => d.healthcare)])
        .range([height, 0]);

    //bottom/left axises
    var POVAxis = d3.axisBottom(xscale);
    var HEALTHAxis = d3.axisLeft(yscale);

    //chart axes
    chart.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(POVAxis);

    chart.append("g")
        .call(HEALTHAxis);

    //dots for states
    var DOTS = chart.selectAll("circle")
        .data(PHData)
        .enter()
        .append("circle")
        .attr("cx", d => xscale(d.poverty))
        .attr("cy", d => yscale(d.healthcare))

        .attr("r", "12")

        .attr("fill", "indigo")

        .attr("opacity", ".7S");

    // d3 tip

    var d3Tip = d3.tip()
        .attr("class", "d3tip")
        .offset([80, -60])
        .html(function (d) {
            return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
        });

    chart.call(d3Tip);
    DOTS.on("click", function (data) {
        d3Tip.show(data, this);
    })




    // x/y labels
    chart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .style("fill", "white")
        .style("font", "20px sans-serif")
        .style("font-weight", "bold")
        .text("lack of Healthcare ");

    chart.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .style("font", "20px sans-serif")
        .style("font-weight", "bold")
        .text("Poverty rates");

}).catch(function (error) {
    console.log(error);
});