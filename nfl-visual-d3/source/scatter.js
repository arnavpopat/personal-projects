// create spec
var spec = { 
    "$schema": "https://vega.github.io/schema/vega/v5.json",
    description: "NFL Concussion Data vizualization",
    width: 650,
    height: 400,
    padding: 50,
    signals: [
        {
            name: "displayText",
            value: {},
            on: [
                {
                    events: "symbol:mouseover",
                    update: "datum"
                },
                {
                    events: "symbol:mouseout",
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
        
    ],
    scales: [
        {
            name: "xScale",
            type: "band",
            //domain: { data: "concussions", field: "Week_of_Injury" },
            domain: ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19'],
            range: "width",
            padding: 1
        },
        {
            name: "yScale",
            type: "linear",
            domain: { data: "concussions", field: "Games_Missed" },
            range: "height"
        },
        {
            name: "color",
            type: "ordinal",
            domain: { data: "concussions", field: "Reported_Injury_Type" },
            range: {scheme: "dark2"}
        }
       

    ],
    
    legends: [
        {
            stroke: "color",
            title: "Type of Injury",
            padding: 4,
            encode: {
                symbols: {
                    enter: {
                        strokeWidth: {value: 2},
                        size: {value: 50}
                    }
                }
            }
        }
  ],

    marks: [
        {
            type: "symbol",
            from: { data: "concussions"},
            encode: {
                enter: {
                    x: {field: "Week_of_Injury", scale: "xScale" },
                    y: {field: "Games_Missed", scale: "yScale"},      
                    size: {value: 220}


                },
                update: {
                    fill: {scale: "color", field: "Reported_Injury_Type"},
                    stroke: {scale: "color", field: "Reported_Injury_Type"},

                },
                hover: {fill: {value: "black"}}
             
               
                
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
                    x: { signal: "displayText.Week_of_Injury", scale: "xScale"},
                    y: { signal: "displayText.Games_Missed", scale: "yScale" },
                    text: { signal: "displayText.Player"},
                    align: { value: "center" },
                    fill: {value: "black"}
                }
            }
        }
        

    ],
    axes: [
        { 
            scale: "xScale",
            orient: "bottom",
            title: "Week"
        },
        {
            scale: "yScale",
            orient: "left",
            title: "Games Missed",
            grid: true
        }
    ],
    title: {
        text: "Severity of injuries based on week of season"
    }

};

// create runtime
var runtime = vega.parse(spec);

// create view
var view = new vega.View(runtime)
                   .logLevel(vega.Error)
                   .renderer("svg")
                   .initialize("#scatter")
                   .hover();

// run it
view.run();