$(document).ready(function(){
    var url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';
    var margin = {top: 100, bottom: 30, left: 60, right: 20},
        width = 920 - margin.left - margin.right,
        height = 630 - margin.top - margin.bottom;

    var svg = d3.select('.scatterplotGraph')
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom);

    d3.json(url).then(function(data) {
        // if (error) throw error;

        data.forEach(element => {
            element.Place = +element.Place;
            var parsedTime = element.Time.split(':');
            element.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
        });

        // Title
        svg.append('text')
            .attr('id', 'title')
            .attr('x', width/2)
            .attr('y', margin.top / 2)
            .text('Doping in Professional Bicycle Racing');

        svg.append('g')
            .attr('class', 'x axis')
            .attr('id', 'x-axis');

        svg.append('g')
            .attr('class', 'y axis')
            .attr('id', 'y-axis');

    });
});