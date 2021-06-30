d3.json("samples.json").then((incomingData) => {
    console.log(incomingData);
    var data = incomingData;

    //setup ids
    var ids = data.names
    //console.log(ids);

    //setup metadata
    var meta = data.metadata;
    var sample = data.samples;

    //select dropdown
    var dropdown = d3.select("#selDataset")

    //load ids into dropdown
    ids.forEach(function(value,index){
        dropdown.append("option").text(value);
    })


    // select dropdown and isolate value selected


    // create event listener for when new subject is clicked
    d3.selectAll("body").on("change",optionChanged)

    // set up function for when event listener is clicked
    function optionChanged(){

        var selID = dropdown.node().value;
        //console.log(selID);

        // select metadata for selID
        var metaid = meta.filter(metaobj => metaobj.id == selID)
        console.log(metaid);
        var metasummary = metaid[0];
    
        //append metadata into table
        var summary = d3.select(".panel-body");
        summary.html("");
        Object.entries(metasummary).forEach(([key,value])=>{ summary.append("h5").text(`${key}: ${value}`)});

        //isolate sample values,otu_kds, otu_labels for selID
        var filteredsample = sample.filter(sampleobj => sampleobj.id == selID)
        console.log(filteredsample);

        var samplevalues = filteredsample[0].sample_values
        //console.log(samplevalues);

        var sampleotulabels = filteredsample[0].otu_labels
        //console.log(sampleotulabels);

        var sampleotuids = filteredsample[0].otu_ids
        console.log(sampleotuids);

        //build bar chart

        //sort filteredsample
        sortedsample = filteredsample.sort(function(first, second) {
            return second.sample_values - first.sample_values;});
        console.log(sortedsample);

        //isolate variables
        var sortedvalues = sortedsample[0].sample_values
        //console.log(samplevalues);

        var sortedotulables = sortedsample[0].otu_labels
        //console.log(sampleotulabels);

        var sortedotuids = sortedsample[0].otu_ids


        //slice data to ten FILTER FIRST LOOK at sort example and then slice
        slicedvalues = sortedvalues.slice(0,10);
        slicedlables = sortedotulables.slice(0,10);
        slicedidsnum = sortedotuids.slice(0,10);
        slicedids = ' ' + slicedidsnum;
        console.log(slicedids);

        //setup trace
        var trace1 = {
            x: slicedvalues,
            y: slicedids,
            text: slicedlables,
            name: "Belly Button Bar",
            type: "bar",
            orientation: "h"
        };

        //create chartdata and layout
        var chartData = [trace1];

        var layout = {
            title: "top 10 Bacteria Cultures Found",
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
              }
        };

        //plot barchart
        Plotly.newPlot("bar",chartData,layout);
        

        //build bubble chart
        var trace2 = {
            x: sampleotuids,
            y: samplevalues,
            mode: 'markers',
            marker: {
                color: sampleotuids,
                size: samplevalues
            }
        };

        var layout2 = {
            title: "Bacteria Cultures Per Sample",
        };

        var data2 = [trace2];


        // plot bubble chart
        Plotly.newPlot('bubble',data2,layout2);

        // build gauge chart
        //isolate number of washings
        washings = metasummary.wfreq;
        console.log(washings);
        var data = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: washings,
                title: { text: "Belly Button Washing Frequency" },
                type: "indicator",
                mode: "gauge"
            }
        ];
        
        var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
        Plotly.newPlot('gauge', data, layout);


    }
            
})