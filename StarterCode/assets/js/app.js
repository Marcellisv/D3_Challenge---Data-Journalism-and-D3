/// Level 1 Requirement, D3:  Create a scatter plot for visualization of data based on the 2014 ACS 1 year estimates.  
// Set up SVG definitions
let svgWidth = 960;
let svgHeight = 620;

// set up borders in svg
let margin = {
  top: 20, 
  right: 40, 
  bottom: 200,
  left: 100
};

// calculate chart height and width
let width = svgWidth - margin.right - margin.left;
let height = svgHeight - margin.top - margin.bottom;

// append a div class to the scatter element
let chart = d3.select('#scatter')
  .append('div')
  .classed('chart', true);

//append an svg element to the chart 
let svg = chart.append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);

//append an svg group
let chartGroup = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

//initial parameters; x and y axis
let chosenXAxis = 'poverty';
let chosenYAxis = 'healthcare';



//function for updating STATE labels
function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    textGroup.transition()
      .duration(2000)
      .attr('x', d => newXScale(d[chosenXAxis]))
      .attr('y', d => newYScale(d[chosenYAxis]));

    return textGroup
}
//function to stylize x-axis values for tooltips
function styleX(value, chosenXAxis) {

    //style based on variable
    //price
    if (chosenXAxis === 'price') {
        return `${value}%`;
    }
    //household income
    else if (chosenXAxis === 'ratings') {
        return `${value}`;
    }
    else {
      return `${value}`;
    }
}

//funtion for updating circles group
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    //poverty
    if (chosenXAxis === 'poverty') {
      var xLabel = 'Poverty:';
    }
    //income
    else if (chosenXAxis === 'income'){
      var xLabel = 'Median Income:';
    }
    //age
    else {
      var xLabel = 'Age:';
    }
//Y label
  //healthcare
  if (chosenYAxis ==='healthcare') {
    var yLabel = "No Healthcare:"
  }
  else if(chosenYAxis === 'obesity') {
    var yLabel = 'Obesity:';
  }
  //smoking
  else{
    var yLabel = 'Smokers:';
  }

  //create tooltip
  var toolTip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-8, 0])
    .html(function(d) {
        return (`${d.state}<br>${xLabel} ${styleX(d[chosenXAxis], chosenXAxis)}<br>${yLabel} ${d[chosenYAxis]}%`);
  });

  circlesGroup.call(toolTip);

  //add
  circlesGroup.on('mouseover', toolTip.show)
    .on('mouseout', toolTip.hide);

    return circlesGroup;
}
//retrieve data
//d3.csv('desktop/Git/Project-2/blush.csv').then(function(blushData) {

    console.log(ulta_data);
    
    //Parse data
    ulta_data.forEach(function(data){
        data.price = +data.price;
        data.rating = +data.rating;
        
    });

    //create linear scales
    var xLinearScale = xScale(ulta_data, chosenXAxis);
    var yLinearScale = yScale(ulta_data, chosenYAxis);

    //create x axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //append X
    var xAxis = chartGroup.append('g')
      .classed('x-axis', true)
      .attr('transform', `translate(0, ${height})`)
      .call(bottomAxis);

    //append Y
    var yAxis = chartGroup.append('g')
      .classed('y-axis', true)
      //.attr
      .call(leftAxis);
    
    //append Circles
    var circlesGroup = chartGroup.selectAll('circle')
      .data(blushData)
      .enter()
      .append('circle')
      .classed('stateCircle', true)
      .attr('cx', d => xLinearScale(d[chosenXAxis]))
      .attr('cy', d => yLinearScale(d[chosenYAxis]))
      .attr('r', 14)
      .attr('opacity', '.5');

    //append Initial Text
    var textGroup = chartGroup.selectAll('.stateText')
      .data(censusData)
      .enter()
      .append('text')
      .classed('stateText', true)
      .attr('x', d => xLinearScale(d[chosenXAxis]))
      .attr('y', d => yLinearScale(d[chosenYAxis]))
      .attr('dy', 3)
      .attr('font-size', '10px')
      .text(function(d){return d.abbr});

    //create a group for the x axis labels
    var xLabelsGroup = chartGroup.append('g')
      .attr('transform', `translate(${width / 2}, ${height + 10 + margin.top})`);

    var priceLabel = xLabelsGroup.append('text')
      .classed('aText', true)
      .classed('active', true)
      .attr('x', 0)
      .attr('y', 20)
      .attr('value', 'poverty')
      .text('Price');
      

    //create a group for Y labels
    var yLabelsGroup = chartGroup.append('g')
      .attr('transform', `translate(${0 - margin.left/4}, ${height/2})`);

    var priceLabel = yLabelsGroup.append('text')
      .classed('aText', true)
      .classed('active', true)
      .attr('x', 0)
      .attr('y', 0 - 20)
      .attr('dy', '1em')
      .attr('transform', 'rotate(-90)')
      .attr('value', 'price')
      .text('Rating');
    
 
    //update the toolTip
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    //x axis event listener
    xLabelsGroup.selectAll('text')
      .on('click', function() {
        var value = d3.select(this).attr('value');

        if (value != chosenXAxis) {

          //replace chosen x with a value
          chosenXAxis = value; 

          //update x for new data
          xLinearScale = xScale(censusData, chosenXAxis);

          //update x 
          xAxis = renderXAxis(xLinearScale, xAxis);

          //upate circles with a new x value
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

          //update text 
          textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

          //update tooltip
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

          //change of classes changes text
          if (chosenXAxis === 'poverty') {
            povertyLabel.classed('active', true).classed('inactive', false);
            ageLabel.classed('active', false).classed('inactive', true);
            incomeLabel.classed('active', false).classed('inactive', true);
          }
          else if (chosenXAxis === 'age') {
            povertyLabel.classed('active', false).classed('inactive', true);
            ageLabel.classed('active', true).classed('inactive', false);
            incomeLabel.classed('active', false).classed('inactive', true);
          }
          else {
            povertyLabel.classed('active', false).classed('inactive', true);
            ageLabel.classed('active', false).classed('inactive', true);
            incomeLabel.classed('active', true).classed('inactive', false);
          }
        }
      });
    //y axis lables event listener
    yLabelsGroup.selectAll('text')
      .on('click', function() {
        var value = d3.select(this).attr('value');

        if(value !=chosenYAxis) {
            //replace chosenY with value  
            chosenYAxis = value;

            //update Y scale
            yLinearScale = yScale(censusData, chosenYAxis);

            //update Y axis 
            yAxis = renderYAxis(yLinearScale, yAxis);

            //Udate CIRCLES with new y
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            //update TEXT with new Y values
            textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            //update tooltips
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            //Change of the classes changes text
            if (chosenYAxis === 'obesity') {
              obesityLabel.classed('active', true).classed('inactive', false);
              smokesLabel.classed('active', false).classed('inactive', true);
              healthcareLabel.classed('active', false).classed('inactive', true);
            }
            else if (chosenYAxis === 'smokes') {
              obesityLabel.classed('active', false).classed('inactive', true);
              smokesLabel.classed('active', true).classed('inactive', false);
              healthcareLabel.classed('active', false).classed('inactive', true);
            }
            else {
              obesityLabel.classed('active', false).classed('inactive', true);
              smokesLabel.classed('active', false).classed('inactive', true);
              healthcareLabel.classed('active', true).classed('inactive', false);
            }
          }
        });
});
/ @TODO: YOUR CODE HERE!
