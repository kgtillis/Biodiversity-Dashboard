function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  })}
  
  init();

function optionChanged(newSample) {
  buildMetadata(newSample);
}

// -- Displaying Charts on Load
// -- Resource: https://www.bitdegree.org/learn/javascript-onload 
function buildCharts() {
  let loadValue = d3.select("#selDataset").property("value");

  buildMetadata(loadValue);
  
}

// -- Demographic Info Panel

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    var PANEL = d3.select("#sample-metadata");

  // -- Demographic Info Panel Display
  //    forEach Loop to display all key value pairs in webpage. 
    
      PANEL.html("");  

      Object.entries(result).forEach(function([resultKey, resultValue]){

        PANEL.append("h6").text(resultKey + ": " + resultValue);
      
        console.log(resultKey + ': ' + resultValue);
      });

    //console.log(sampleResult);
     
    var sampledata = data.samples;
    var sampleArray = sampledata.filter(sampleObj => sampleObj.id == sample);
    var sampleResult = sampleArray[0];
 
      console.log(sampleResult);

  // -- Whole Bacterial Dataset -- Used for Bubble Chart:

    var total_sample_values = sampleResult.sample_values;
    var total_otu_ids = sampleResult.otu_ids;
    var total_otu_labels = sampleResult.otu_labels;

  // -- Top 10 Bacterial Species -- Used for Bar Chart:
    var sample_values = sampleResult.sample_values.slice(0,10);
    var otu_ids = sampleResult.otu_ids.slice(0,10);
    var otu_labels = sampleResult.otu_labels.slice(0,10);
 
    // -- Adding string to labels for Bar Chart
    otu_id_labels = [];

    Object.entries(otu_ids).forEach(function([filtering,value]){
      otu_id_labels.push("OTU " + value);
    });
    
    // -- Build Bar Chart
    // -- Bar Chart Formatting - Resource: https://plotly.com/javascript/bar-charts/ 
    // -- Display in Descending Order - Resource: https://codepen.io/etpinard/pen/YEbWoO?editors=0010 
    var trace = {
      x: sample_values,
      y: otu_id_labels,
      type: "bar",
      text: otu_labels,
      orientation: 'h',
      transforms: [{
        type: 'sort',
        target: 'y',
        order: 'descending'}],
    };

    var data = [trace];
    var layout = {
      title: "Top 10 Bacterial Species"
    };
    Plotly.newPlot("bar", data, layout);


    // -- Build Bubble Chart
    // -- Resource: https://plotly.com/javascript/bubble-charts/ 
    var trace1 = {
      x: total_otu_ids,
      y: total_sample_values,
      text: total_otu_labels,
      mode: 'markers',
      marker: {
        color: total_otu_ids,
        opacity: [1, 0.8, 0.6, 0.4],
        size: total_sample_values,
      }
    };
    
    var data = [trace1];
    
    var layout = {
      xaxis: { title: "OTU ID" },
      showlegend: false
    };
    
    Plotly.newPlot("bubble", data, layout);


// -- Extension - Gauge
// -- Resource: https://www.instructables.com/id/Showing-Charts-and-Gauges-of-IOT-Device-Data-Using/ 
// -- Heavily used and modified Javascript Code for Gauge plot. 

// -- Modified Level variable to accept Wfreq value from result array. 
var level = result.wfreq

// Trig to calc meter point
// -- Modified degree formula to accomodate 9 sections
var degrees = 180 - (level * 20),
     radius = .5;
var radians = degrees * Math.PI / 180;
var x = radius * Math.cos(radians);
var y = radius * Math.sin(radians);

// Path: may have to change to create a better triangle
var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
     pathX = String(x),
     space = ' ',
     pathY = String(y),
     pathEnd = ' Z';
var path = mainPath.concat(pathX,space,pathY,pathEnd);

// -- Adjusted settings to display values, labels, colors, and adjusted gauge section sizes
var data = [{ type: 'scatter',
   x: [0], y:[0],
    marker: {size: 28, color:'850000'},
    showlegend: false,
    name: 'test',
    text: level,
    hoverinfo: 'text+name'},
  { values: [20, 20, 20, 20, 20, 20, 20, 20, 20, 180],
  rotation: 90,
  text: ['8-9', '7-8', '6-7', '5-6',
            '4-5', '3-4', '2-3', '1-2','0-1', ''],
  textinfo: 'text',
  textposition:'inside',
  marker: {colors:['rgba(133,180,138, 5)','rgba(138,187,143, 1)','rgba(140,191,136, 1)', 'rgba(110, 154, 22, .5)',
                         'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                         'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                         'rgba(232, 226, 202, .3)', 'rgba(255, 255, 255, 0)']},
  labels: ['8-9', '7-8', '6-7', '5-6',
  '4-5', '3-4', '2-3', '1-2','0-1', ''],
  hoverinfo: 'label',
  hole: .5,
  type: 'pie',
  showlegend: false
}];

var layout = {
  shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
  // -- Changed title to match Challenge example
  title: '<b>Belly Button Washing Frequency</b> <br> Scrubs Per Week',
  xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
  yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
};

Plotly.newPlot('gauge', data, layout);

  }); // -- end of d3.then loop

} // -- end of buildMetadata Function 
