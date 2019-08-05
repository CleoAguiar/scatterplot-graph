$(document).ready(function(){
    var url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';
    var margin = {top: 100, bottom: 30, left: 60, right: 20},
        width = 920 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleTime().range([0, height]);

    var color = d3.scaleOrdinal(d3.schemeSet1);
    var timeFormat = d3.timeFormat('%M:%S');
    var xAxis = d3.axisBottom(x).tickFormat(d3.format('d'));
    var yAxis = d3.axisLeft(y).tickFormat(timeFormat);

    var tooltip = d3.select('.scatterplotGraph')
                    .append('div')
                    .attr('class', 'tooltip')
                    .attr('id', 'tooltip')
                    .style('opacity', 0);

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

        var mouseover = function (d) {
            tooltip.style('opacity', .9);
            tooltip.attr('data-year', d.Year);

            var tooltipText = d.Name + ': ' + d.Nationality + '<br/>'
                                + 'Year: ' + d.Year + ', Time: ' + timeFormat(d.Time)
                                + (d.Doping ? '<br/><br/>' + d.Doping : '');
            tooltip.html(tooltipText)
                    .style('left', (d3.event.pageX + 15) + 'px')
                    .style('top', (d3.event.pageY - 28) + 'px');
        }

        var mouseout = function (d) {
            tooltip.style('opacity', 0);
        }

        // Dots
        svg.selectAll('.dot')
            .data(data)
            .enter().append('circle')
            .attr('class', 'dot')
            .attr('cx', element => x(element.Year))
            .attr('cy', element => y(element.Time))
            .attr('r', 5)
            .attr('data-xvalue', element => element.Year)
            .attr('data-yvalue', element => element.Time.toISOString)
            .style('fill', element => color(element.Doping != ''))
            .on('mouseover', mouseover)
            .on('mouseout', mouseout);

        // Legend
        var legend = svg.selectAll('.legend')
                        .data(color.domain())
                        .enter().append('g')
                        .attr('class', 'legend')
                        .attr('id', 'legend')
                        .attr('transform', (d, i) => 'translate(0,' + (height/2 - i * 20) + ')');

        legend.append('rect')
              .attr('x', width - 18)
              .attr('width', 18)
              .attr('height', 18)
              .style('fill', color);

        legend.append('text')
              .attr('x', width - 24)
              .attr('y', 9)
              .attr('dy', '.35em')
              .style('text-anchor', 'end')
              .text(element => element ? 'Riders with doping allegations'
                                        : 'No doping allegations');

    });
});