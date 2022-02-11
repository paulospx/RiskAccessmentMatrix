/**
 * Created by Paulo P. on 14-12-2016.
 */

var HzRam = (function () {
    var id = '#chart';
    var list = [];
    var range = 5;
    var size = 50;
    var selectedStyle = "fill: white;";
    var title = "Risk Assessment Matrix";
    var subtitle = "";
    var selection = ""; // 2 x 2
    var show_hover = true;
    var show_clicked = true;
	var xaxis = "Consequence";
	var yaxis = "Probability";

    function start() {
        var margin = { left: 50, top: 100 };
        var numRows = list.length/range;
        
        var width = (size * range) + margin.left + margin.left,
            height = (size * numRows) + margin.top + margin.top,
            div = d3.select(id),
            svg = div.append('svg')
                .attr('width', width)
                .attr('height', height),
            rw = size,
            rh = size;
        var data = [];
        for (var k = 0; k < numRows; k += 1) {
            data.push(d3.range(range));
        }


        function drawRects(grps) {
            grps.append('rect')
                .attr('x', function (d, i) {
                    return (size * i);
                })
                .attr('fill', function (d, i, z) {
                    var l = d + (z * range);
                    var c = "#EEE";
                    if (typeof(list[l])==="object") {
                        c =  list[l].color;
                    }
                    return c;
                })
                .attr('stroke-width','0.5')
                .attr('width', rw)
                .attr('stroke', 'black')
                .attr('height', rh);

            grps.append('text')
                .attr('x', function (x) {
                    return x * rw + (rw / 3);
                })
                .attr('y', function () {
                    return (rh/2);
                })
                .attr('font-size', function(a,b) {
                    if (size < 30) {
                        return size /2;
                    }
                    return 12;
                })
                .attr("font-family", "sans-serif")
                .attr('color', '#000')
                .attr('width', rw)
                .attr('height', rh)
                .text(function (d, i, z) {
                    var l = d + (z * range);
                    var t = "NA";
                    if (typeof(list[l])==="object") {
                        t =  list[l].text;
                    }
                    return t;
                });
        }

        var grp = svg.selectAll('g')
            .data(data)
            .enter()
            .append('g')
            .attr('transform', function (d, i) {
                return 'translate(0, ' + (size * i) + ')';
            });

        var grps = grp.selectAll('rect')
            .data(function (d) {
                return d;
            })
            .enter()
            .append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

       drawRects(grps);

        // Title
        svg.append('g')
            .append('text')
            .attr('class','ram-title')
            .attr('x',margin.left)
            .attr('y',50)
            .attr('style','font-family: "Roboto", sans-serif;font-size: 22px;')
            .text(title);

        // Sub title
        svg.append('g')
            .append('text')
            .attr('color','#DDD')
            .attr('class','ram-subtitle')
            .attr('x',margin.left)
            .attr('y', 70)
            .attr('style','font-fam ily: "Roboto", sans-serif;font-size: 12px;fill:#999;')
            .text(subtitle);

        // Y-Axis Label
        svg.append('g')
            .attr('writing-mode','tb-rl')
            .append('text')
            .attr('color','#DDD')
            .attr('class','ram-subtitle')
            .attr('x', (margin.left / 2) + 10 )
            .attr('y', width - 100 )
            .attr('style','font-family: "Roboto", sans-serif;font-size: 16px;fill:#999;')
            .text(yaxis);

         var adjust = (numRows - range) * size;
         if (adjust<0) {adjust =0;}

        // X-Axis Label
         svg.append('g')
         .append('text')
         .attr('color','#DDD')
         .attr('class','ram-subtitle')
         .attr('x', margin.left)
         .attr('y', width + adjust + 20)
         .attr('style','font-family: "Roboto", sans-serif;font-size:10 px;fill:#999;')
         .text(xaxis);

        // Selected Risk Label
        svg.append('g')
            .append('text')
            .attr('color','#DDD')
            .attr('class','ram-selected-text')
            .attr('x',margin.left)
            .attr('y', width + adjust + 40)
            .attr('style','font-family: "Roboto", sans-serif;font-size:10px;fill:#000;')
            .text('Title');

        svg.append('g')
            .append('text')
            .attr('color','#DDD')
            .attr('class','ram-selected-probability')
            .attr('x',margin.left)
            .attr('y', width + adjust + 50)
            .attr('style','font-family: "Roboto", sans-serif;font-size:10px;fill:#000;')
            .text('Probability');

        svg.append('g')
            .append('text')
            .attr('color','#DDD')
            .attr('class','ram-selected-consequence')
            .attr('x',margin.left)
            .attr('y', width + adjust + 60)
            .attr('style','font-family: "Roboto", sans-serif;font-size:10px;fill:#000;')
            .text('Consequence');

        svg.selectAll("rect")
            .on('mouseover', function (d, i, z) {
                // var l = d + (z * range);
                var hz = list[i];
                //onhover(hz.probability, hz.consequence, hz.text, hz.description);
                if (show_hover) {
                    svg.selectAll(".ram-selected-text").text(hz.text);
                    svg.selectAll(".ram-selected-probability").text(hz.probability);
                    svg.selectAll(".ram-selected-consequence").text(hz.consequence);
                }
            })
            .on('click', function(d,i,z){
                var l = d + (z * range);
                var hz = list[i];
                if (show_clicked) {
                    svg.selectAll(".ram-selected-text").text(hz.text);
                    svg.selectAll(".ram-selected-probability").text(hz.probability);
                    svg.selectAll(".ram-selected-consequence").text(hz.consequence);
                    onclick(hz.probability, hz.consequence, hz.text, hz.description);
                }
                d3.selectAll('rect').attr('class','');
                d3.select(this).attr('class','ram-selected');
            });
    }

    function getImage() {
        var html = d3.select("svg")
            .attr("version", 1.1)
            .attr("xmlns", "http://www.w3.org/2000/svg")
            .node().parentNode.innerHTML;

        var imgsrc = 'data:image/svg+xml;base64,'+ btoa(html);
        var img = '<img src="'+imgsrc+'">';
        d3.select("#svgdataurl").html(img);

        d3.select(".ram-selected")
            .style("fill", "#FFF")
            .style("stroke-width", "5");


        var canvas = document.querySelector("canvas"),
            context = canvas.getContext("2d");

        var image = new Image;
        image.src = imgsrc;
        image.onload = function() {
            context.drawImage(image, 0, 0);
            var canvasdata = canvas.toDataURL("image/png");
            var pngimg = '<img src="'+canvasdata+'">';
            d3.select("#pngdataurl").html(pngimg);
            var a = document.createElement("a");
            a.download = "risk-access-matrix.png";
            a.href = canvasdata;
            a.click();
        };
    }

    var onhover = function(p,c,t,d) {
        console.log(p,c,t,d);
    };

    var onclick = function(p,c,t,d) {
        console.log(p,c,t,d);
    }

    function setOptions(options) {
        if (options === undefined) return;
        if (options.title != undefined) {
            title = options.title;
        }
		if (options.xaxis != undefined) {
			xaxis = options.xaxis;
		}
		if (options.yaxis != undefined) {
			yaxis = options.yaxis;
		}
        subtitle = options.subtitle;
        id = options.id;
        list = options.list;
        range = options.matrix_size;
        size = options.square_size;
        onclick = options.onclick;
        onhover = options.onhover;
        if (options.show_hover != undefined) {
            show_hover = options.show_hover;
        }
        if (options.show_clicked != undefined) {
            show_clicked = options.show_clicked;
        }
    }

    return {
        setOptions: function(options) {
            setOptions(options);
        },
        show: function (options) {
            setOptions(options);
            start();
        },
        download: function() {
            return getImage();
        }
    };
}());
