function buildMetadata(sample) {
  
  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var metaData = `/metadata/${sample}`;

    d3.json(metaData).then(function(sample){
    // Use d3 to select the panel with id of `#sample-metadata`
    var sampleData = d3.select(`#sample-metadata`);
    // Use `.html("") to clear any existing metadata
    sampleData.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    var metaList = sampleData.append
    
    Object.entries(sample).forEach(function([key,value]){
      console.log(key,value);
      var row = sampleData.append("ul");
      row.text(`${key}:${value}`);
    });
  });
 
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}
function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var samplesRoute = `/samples/${sample}`;
    // console.log(samplesRoute);
    d3.json(samplesRoute).then(function(sample){
      // console.log(sample);
    // Slice top ten
    var topSampval = sample.sample_values.slice(0,9);
    var topOtuid = sample.otu_ids.slice(0,9);
    var topOtulabel = sample.otu_labels.slice(0,9);
    
    // Pie Chart
    var dataPie = [{
      values: topOtuid,
      labels: topOtulabel,
      hoverinfo: topSampval,
      type: 'pie'
    }];
    
    var layout = {
      height: 600,
      width: 800,
      showlegend: true,
      legend: {x:1, y:1}
    };
    
    Plotly.newPlot('pie', dataPie, layout);
     
    // Bubble variables
    var sampVal = sample.sample_values;
    var otuId = sample.otu_ids;
    var otuLabel = sample.otu_labels;
    // Build a Bubble Chart 
    var trace1 = {
      x: otuId,
      y: sampVal,
      text: otuLabel,
      mode: 'markers',
      marker: {
        color: otuId,
        size: sampVal,
        sizeref: .5,
        sizemode: 'area'
      }
    };
    
    var dataBubble = [trace1];
    
    var layout = {
      title: 'Bubble Chart Hover Text',
      showlegend: true,
      height: 600,
      width: 1200
    };
    
    Plotly.newPlot('bubble', dataBubble, layout);

    
});
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
