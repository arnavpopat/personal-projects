// create spec
var spec = { 
    "$schema": "https://vega.github.io/schema/vega/v5.json",
    description: "NFL Concussion Data vizualization",
    width: 1100,
    height: 350,
    padding: 50,
    signals: [
        { 
            name: "SevereInjury",
            value: false,
            bind: {
                    input: "select",
                    options: [false, true],
                    element: "#selector"
                }
        },
        {
            name: "displayText",
            value: {},
            on: [
                {
                    events: "rect:mouseover",
                    update: "datum"
                },
                {
                    events: "rect:mouseout",
                    update: "{}"
                }
            ]
        }
        
    ],

    data: [
        {
            name: "concussions",
            url: "https://raw.githubusercontent.com/arnavpopat/csc-444-data/main/Concussion_Injuries.csv",
            format: { type: "csv"},
            
        },
        {
            name: "counts",
            source: "concussions",
            transform: [
                {
                    type: "formula",
                    expr: "datum.Games_Missed > 2",
                    as: "severe"
                },
                {
                    type: "filter",
                    expr: "datum.severe == SevereInjury"
                },
                {
                    type: "aggregate",
                    groupby: ["Position"]
                },
                {
                    type: "collect",
                    sort: { field: "count", order: "descending" }
                },
                
            ]
        }
    ],
    scales: [
        {
            name: "xScale",
            type: "band",
            domain: { data: "counts", field: "Position" },
            range: "width",
            padding: 0.3
        },
        {
            name: "yScale",
            type: "linear",
            domain: { data: "counts", field: "count" },
            range: "height"
        }

    ],
    marks: [
        {
            type: "rect",
            from: { data: "counts"},
            encode: {
                enter: {
                    x: {field: "Position", scale: "xScale" },
                    y2: {value: 0, scale: "yScale"},
                    y: {field: "count", scale: "yScale"},
                    width: {value: 50},
                },
                update: {
                    fill: {value: "#ccff66"},
                    fillOpacity: {value: .8},
                    stroke: {value: "black"},
                    strokeWidth: {value: 3}
                },
                hover: {fill: {value: "black"}},

                
            }
        },
        {
            type: "text",
            encode: {
                enter: {
                    dx: {value: 25},
                    dy: {value: 20},
                },
                update: {
                    x: { signal: "displayText.Position", scale: "xScale"},
                    y: { signal: "displayText.count", scale: "yScale" },
                    text: { signal: "displayText.count"},
                    align: { value: "center" },
                    fill: {value: "white"}
                }
            }
        }

    ],
    axes: [
        { 
            scale: "xScale",
            orient: "bottom",
            title: "Position"
        },
        {
            scale: "yScale",
            orient: "left",
            title: "Number of injuries",
            grid: true
        }
    ],
    title: {
        text: "Injuries by position"
    }

};

// create runtime
var runtime = vega.parse(spec);

// create view
var view = new vega.View(runtime)
                   .logLevel(vega.Error)
                   .renderer("svg")
                   .initialize("#bar")
                   .hover();

// run it
view.run();