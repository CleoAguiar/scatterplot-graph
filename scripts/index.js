$(document).ready(function(){
    var url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';
    var margin = {top: 100, bottom: 30, left: 60, right: 20},
        width = 920 - margin.left - margin.right,
        height = 630 - margin.top - margin.bottom;

    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleTime().range([0, height]);

    var timeFormat = d3.timeFormat('%M:%S');
    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y).tickFormat(timeFormat);

    var svg = d3.select('.scatterplotGraph')
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')' );

    var parsedTime;

    d3.json(url).then(function(data) {
        // if (error) throw error;

        data.forEach(element => {
            element.Place = +element.Place;
            parsedTime = element.Time.split(':');
            element.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
        });

        // Title
        svg.append('text')
            .attr('id', 'title')
            .attr('x', width/2)
            .attr('y', margin.top / 2)
            .text('Doping in Professional Bicycle Racing');

        // xAxis
        x.domain([d3.min(data, element => element.Year - 1), d3.max(data, element => element.Year + 1) ]);
        svg.append('g')
            .attr('class', 'x axis')
            .attr('id', 'x-axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        // yAxis
        y.domain(d3.extent(data, element => element.Time));
        svg.append('g')
            .attr('class', 'y axis')
            .attr('id', 'y-axis')
            .call(yAxis);

        // Dots
        svg.selectAll('.dot')
            .data(data)
            .enter().append('circle')
            .attr('class', 'dot')
            .attr('cx', element => x(element.Year))
            .attr('cy', element => y(element.Time))
            .attr('r', 5)
            .attr('data-xvalue', element => element.Year)
            .attr('data-yvalue', element => element.Time.toISOString);
    });
});