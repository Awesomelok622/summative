/* eslint no-unused-vars: ["error", { "args": "none" }] */
/** 
 * This is the main function that will be called in the <body> in the html. 
 * @function main
 * @classdec This function includes the main body of the bar chart.
 */
function main() {
    /* global d3 */
    /* eslint no-undef: "error" */
    /** Constructing svg and setting its attributes 
     * @var 
    */
    const svg = d3.select('svg');
    /**
     * @constant
     * @default
     */
    const margin = 200;
    /**
     * width
     * @type {number}
     */
    const width = svg.attr('width') - margin;
    /**
     * height
     * @type {number}
     */
    const height = svg.attr('height') - margin;
    /** Setting attributes of a title of the bar chart */
    svg.append('text')
        .attr('transform', 'translate(100,0)')
        .attr('x', 50)
        .attr('y', 50)
        .attr('font-size', '24px')
        .text('Arising Sea Level from 2016 to 2021');
    /** Constructing the scale to make the columns fit into the graph and change in size */
    const xScale = d3.scaleBand().range([0, width]).padding(0.4);
    const yScale = d3.scaleLinear().range([height, 0]);

    const g = svg.append('g')
        .attr('transform', 'translate(' + 100 + ',' + 100 + ')');
    /** Get data from csv by using d3 and set the id for x-axis and y-axis */
    d3.csv('sealevel.csv').then(function (data) {
        xScale.domain(data.map(function (d) { return d.year; }));
        yScale.domain([0, d3.max(data, function (d) { return d.value; })]);
        /** Set attributes for y-axis */
        g.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(xScale))
            .append('text')
            .attr('y', height - 250)
            .attr('x', width - 100)
            .attr('text-anchor', 'end')
            .attr('stroke', 'black')
            .text('Year');
        /** Set attributes for x-axis */
        g.append('g')
            .call(d3.axisLeft(yScale).tickFormat(function (d) { return d + 'mm'; }).ticks(10))
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0)
            .attr('dy', '-5em')
            .attr('text-anchor', 'end')
            .attr('stroke', 'black')
            .text('Sea Level in millimeters');
        /** Set attributes for the bar animation, onMouseOver and onMouseOut */
        g.selectAll('.bar')
            .data(data)
            .enter().append('rect')
            .attr('class', 'bar')
            .on('mouseover', onMouseOver) // Add listener for event
            .on('mouseout', onMouseOut)
            .attr('x', function (d) { return xScale(d.year); })
            .attr('y', function (d) { return yScale(d.value); })
            .attr('width', xScale.bandwidth())
            .transition()
            .ease(d3.easeLinear)
            .duration(500)
            .delay(function (d, i) { return i * 50; })
            .attr('height', function (d) { return height - yScale(d.value); });
    });

    // Mouseover event handler
    /** This function is for enlarging the size of the column when the pointer is on the column and show the animation of the bar chart dropping down 
     * @class 
     * @param {number} d
     * @param {number} i
     * */
    function onMouseOver(d, i) {
        d3.select(this).attr('class', 'highlight');
        d3.select(this)
            .transition() // I want to add animnation here
            .duration(500)
            .attr('width', xScale.bandwidth() + 5)
            .attr('y', function (d) { return yScale(d.value) - 10; })
            .attr('height', function (d) { return height - yScale(d.value) + 10; });
    }

    // Mouseout event handler
    /** This function is for resizing the column once the pointer leaves the column 
     * @class
     * @param {number} d
     * @param {number} i
    */
    function onMouseOut(d, i) {
        d3.select(this).attr('class', 'bar');
        d3.select(this)
            .transition()
            .duration(500)
            .attr('width', xScale.bandwidth())
            .attr('y', function (d) {
                return yScale(d.value);
            })
            .attr('height', function (d) {
                return height - yScale(d.value);
            });
    }
}
