// TODO
// - request API key for OSM
// - add contributors : map icons, Fuse.js
// - use sprites for icons
// - icon is reloaded when making a layer visible again
// - layers control : add All on/off toggle ?
// - improve Fuse.js to consider accents ...

var categories = {
    101 : {desc: "اماکن المقدسة", icon:"museum_archeological.png"},/////////////
    102 : {desc: "الأماكن المفضلة ", icon:"mural.png"},
    103 : {desc: "مراكز صحية", icon:"mural.png"},///////////////////////////////
    104 : {desc: "استراحات الزائرين", icon:"mural.png"},
    105 : {desc: "نقاط التفتيش", icon:"music_choral.png"},
    106 : {desc: "فنادق", icon:"museum_art.png"},///////////////////////////////
    107 : {desc: "اعمدة", icon:"theater.png"},//////////////////////////////////
    108 : {desc: "محطات النقل", icon:"cinema.png"},/////////////////////////////
    109 : {desc: "مراكز المفقودين", icon:"cinema.png"},
    110 : {desc: "القنصليات", icon:"cinema.png"},
    111 : {desc: "خدمات الزائرين", icon:"cinema.png"},
};

var setupIcons = function() {

    var icons = {};
    for (var cat in categories) {
        var icon = categories[cat].icon;
        var url = "maps/images/" + icon;
 
        var icon = L.icon({
            iconUrl: url,
            iconSize: [32, 32],
            iconAnchor: [16, 37],
            popupAnchor: [0, -28]
        });
        icons[cat] = icon;
    }
    
    return icons;
};

var map;

$(function() {

    // Set map height to remaining window height
    // FIXME Best done with CSS
    $(window).resize(function() {
        // remaining height - 22 (wrapper bottom padding + map border + 1) !
        $('#map').height($(window).height());
    });
    $(window).resize();

    // Create a Leaflet map with OSM background
    //var osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	var osmLayer = L.tileLayer('http://imamali.net/app-json/map/{z}/{x}/{y}.png', {
    //var osmLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
    //var osmLayer = L.tileLayer('http://b.tile.cloudmade.com/9d991d739a924642a9664d59abf90002/1/256/{z}/{x}/{y}.png', {
    //    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });

    map = L.map('map', {
        center: new L.LatLng(32.0192,44.3298),
        zoom: 13,
        maxZoom: 18,
        layers: [osmLayer]
    });

    // Layer control, setting up 1 layer per category
    var layers = {},
        cultureLayer = L.layerGroup(),
        layerCtrl = L.control.layers();
    for (var icat in categories) {
        var layer = L.featureGroup();
        layers[icat] = layer;
        cultureLayer.addLayer(layer);
        
        var cat = categories[icat],
            desc = '<img class="layer-control-img" src="maps/images/' + cat.icon + '"> ' + cat.desc;
        layerCtrl.addOverlay(layer, desc);
    }
    cultureLayer.addTo(map);
    
    // Information pane
    //L.control.infoPane('infopane', {position: 'bottomright'}).addTo(map);
    
    // Add fuse search control
    var options = {
        position: 'topright',
        title: 'Chercher',
        placeholder: 'ex: rezé, cinéma, biblio',
        maxResultLength: 15,
        threshold: 0.5,
        showInvisibleFeatures: true,
        showResultFct: function(feature, container) {
            props = feature.properties;
            var name = L.DomUtil.create('b', null, container);
            name.innerHTML = props.nom_comple;

            // container.appendChild(L.DomUtil.create('br', null, container));

            var cat = props.libtype ? props.libtype : props.libcategor,
                info = '' + cat + ', ' + props.commune;
            // container.appendChild(document.createTextNode(info));
        }
    };
    var fuseSearchCtrl = L.control.fuseSearch(options);
    map.addControl(fuseSearchCtrl);

    layerCtrl.addTo(map);

    var icons = setupIcons();

    // Load the data
    jQuery.getJSON("maps/data/points.json", function(data) {
        displayFeatures(data.features, layers, icons);
        var props = ['nom_comple', 'libcategor', 'commune'];
        fuseSearchCtrl.indexFeatures(data.features, props);
    });
    
});    

function displayFeatures(features, layers, icons) {

    var popup = L.DomUtil.create('div', 'tiny-popup', map.getContainer());
                    
    for (var id in features) {
        var feat = features[id];
        var cat = feat.properties.categorie;
        var site = L.geoJson(feat, {
            pointToLayer: function(feature, latLng) {
                var icon = icons[cat];
                var marker = L.marker(latLng, {
                    icon: icon,
                    keyboard: false,
                    riseOnHover: true
                });
                if (! L.touch) {
                    marker.on('mouseover', function(e) {
                        var nom = e.target.feature.properties.nom_comple;
                        var pos = map.latLngToContainerPoint(e.latlng);
                        popup.innerHTML = nom;
                        L.DomUtil.setPosition(popup, pos);
                        L.DomUtil.addClass(popup, 'visible');

                    }).on('mouseout', function(e) {
                        L.DomUtil.removeClass(popup, 'visible');
                    });
                }
                return marker;
            },
            onEachFeature: bindPopup
        });
        var layer = layers[cat];
        if (layer !== undefined) {
            layer.addLayer(site);
        }
    }
    return layers;
}
 
function bindPopup(feature, layer) {
    // Keep track of the layer(marker)
    feature.layer = layer;
    
    var props = feature.properties;
    if (props) {
        var desc = '<span id="feature-popup">';
        desc += '<strong>' + props.nom_comple + '</strong>';
        desc += '</span>';
        layer.bindPopup(desc);
    }
}
