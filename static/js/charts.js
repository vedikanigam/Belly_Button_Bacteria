function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}
// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}
// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}
// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {

    // 3. Create a variable that holds the samples array. 
    var samples = data.samples
    var metadata=data.metadata
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(Obj =>Obj.id == sample)
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metaResultarray = metadata.filter(Obj =>Obj.id == sample)
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    // 2. Create a variable that holds the first sample in the metadata array.
    var metadataResult = metaResultarray[0];
    console.log(metadataResult.wfreq)
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuID = Object.values(result.otu_ids)
    var otuLabels = Object.values(result.otu_labels)
    var sampleValues = Object.values(result.sample_values)
    
    // 3. Create a variable that holds the washing frequency.
    var washingFrequency = metadataResult.wfreq
    
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    yticks = otuID.map(ylabel=>"OTUID"+ylabel).slice(0,10).reverse()
    xvalues = sampleValues.slice(0,10).reverse()
    // 8. Create the trace for the bar chart. 
    var barData = [{
      type: 'bar',
      x:xvalues,
      y:yticks,
      orientation: 'h'
      }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData,barLayout);
    
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      mode: 'markers',
      marker:{
        size:sampleValues,
        color:otuID,
        colorscale: "Earth"
      },
      x: otuID,
      y:sampleValues,
      text: otuLabels 
    }];  
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      xaxis: {title: "OTU ID" }    
    };
    // 3. Use Plotly to plot the data with the layout.   
    Plotly.newPlot("bubble", bubbleData,bubbleLayout); 

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      { domain: { x: [0, 1], y: [0, 1] },
        value: washingFrequency,
        title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"},
        type: "indicator",
        mode: "gauge+number",
        delta: { reference: 400 },
        
        gauge: { axis: { range: [0,10] },
                  bar: {color:"Black"},
                  steps:[
                    {range:[0,2], color:"red"},
                    {range:[2,4], color:"orange"},
                    {range:[4,6], color:"yellow"},
                    {range:[6,8], color:"lightgreen"},
                    {range:[8,10], color:"green"},]
                   }
      }
    ];
    var gaugeLayout = { width: 460, height: 400 };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge",gaugeData, gaugeLayout);
    
  });
}
