var json = null;

function displayMap() {
    am4core.ready(function () {

// Themes begin
        am4core.useTheme(am4themes_dataviz);
        am4core.useTheme(am4themes_animated);
// Themes end

// Create map instance
        var chart = am4core.create("chartdiv", am4maps.MapChart);

// Set map definition
        chart.geodata = am4geodata_worldLow;

// Set projection
        chart.projection = new am4maps.projections.EqualEarth();

// Create map polygon series
        var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

// Make map load polygon (like country names) data from GeoJSON
        polygonSeries.useGeodata = true;

// Configure series
        var polygonTemplate = polygonSeries.mapPolygons.template;
        polygonTemplate.tooltipText = "{name}";
        polygonTemplate.polygon.fillOpacity = 0.6;


// Create hover state and set alternative fill color
        var hs = polygonTemplate.states.create("hover");
        hs.properties.fill = chart.colors.getIndex(0);

// Add image series
        var imageSeries = chart.series.push(new am4maps.MapImageSeries());


        imageSeries.mapImages.template.propertyFields.longitude = "longitude";
        imageSeries.mapImages.template.propertyFields.latitude = "latitude";
        imageSeries.mapImages.template.tooltipText = "{Title} : {Percent} %";
        imageSeries.mapImages.template.url = "./show?city={Title}";


        imageSeries.data = JSON.parse(json);

        var circle = imageSeries.mapImages.template.createChild(am4core.Circle);
        circle.radius = 3;
        circle.propertyFields.fill = "color";

        var circle2 = imageSeries.mapImages.template.createChild(am4core.Circle);
        circle2.radius = 3;
        circle2.propertyFields.fill = "color";


        circle2.events.on("inited", function (event) {
            animateBullet(event.target);
        })


        function animateBullet(circle) {
            var animation = circle.animate([{property: "scale", from: 1, to: 5}, {
                property: "opacity",
                from: 1,
                to: 0
            }], 1000, am4core.ease.circleOut);
            animation.events.on("animationended", function (event) {
                animateBullet(event.target.object);
            })
        }

    })
    am4core.ready()
}

function drawMap(year) {
    if (year == null) {
        year = 1990;
    }
    getHTTPPost("./data?Year=" + year, "", function (data) {
        json = data;
        displayMap();
    })

}

drawMap(1990);

function newLength() {
    document.getElementById("length").innerHTML = document.getElementById("lengthSlider").value;
    drawMap(document.getElementById("lengthSlider").value);
}

function getHTTPPost(url, data, success) {
    let b = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    b.open('GET', url);
    b.onreadystatechange = function () {
        if (b.readyState > 3 && b.status >= 200) {
            success(b.responseText);
        }
    };
    b.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    b.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    b.send(data);
}

function changtab() {
    getHTTPPost("./histo?city=" + document.getElementById("inlineFormCustomSelect").value, "", function (data) {
        document.getElementById("tab").innerHTML = '';
        JSON.parse(data).forEach(function (e) {
            var tab = document.getElementById("tab")
            var line = insert(tab, "tr", "")
            insert(line, "th", "", "", e.Year)
            insert(line, "td", "", "", e.Percent + " %")
        });
    })
}


function insert(parent, balise, id, text_class = null, text = null) {//fonction for create element on an parent and return the new element
    var newObj = document.createElement(balise);
    newObj.id = id;
    newObj.textContent = text;
    newObj.className = text_class;
    parent.appendChild(newObj);
    return newObj;
}