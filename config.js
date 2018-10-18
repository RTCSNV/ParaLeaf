var config = {
    "title": "Paratransit Vehicle History",
    "start": {
        //"maxZoom": 16,
        "center": [36.114647,-115.172813],
        "zoom": 11,
        "attributionControl": false,
        "zoomControl": false
    },
    "about": {
        "title": "Paratransit Vehicle History",
        "contents": "<p>This is an open-source version of the excellent <a href='https://github.com/bmcbride/bootleaf'>Bootleaf map </a>started by Bryan McBride.</p><p>It's designed for rapid web map development. See <a href='https://github.com/iag-geo/bootleaf'>https://github.com/iag-geo/bootleaf</a> for more information.</p><p>Chage this message in the config file</p>"
    },
    "controls": {
        "zoom": {
            "position": "topleft"
        },
        "leafletGeocoder": {
            //https://github.com/perliedman/leaflet-control-geocoder
            "collapsed": false,
            "position": "topleft",
            "placeholder": "Search for a location",
            "type": "Google", // OpenStreetMap, Google, ArcGIS
            //"suffix": "Australia" // optional keyword to append to every search
        },
        "TOC": {
            //http://leafletjs.com/reference-1.0.2.html#control-layers-option
            "collapsed": false,
            "uncategorisedLabel": "Layers",
            "position": "topright"
        },
        "history": {
            "position": "bottomleft"
        },
        "bookmarks": {
            "position": "bottomright",
            "places": [
                {
                "latlng": [
                    36.07,
                    -115.213
                ],
                "zoom": 14,
                "name": "Sunset Facility",
                "id": "a148fa354ba3",
                "editable": true,
                "removable": true
                }
            ]
        }
    },

    "basemaps": ['esriStreets','esriGray', 'esriDarkGray',  'OpenStreetMap'],

    "tocCategories": [
        {
            "name": "GIS layers",
            "layers": ["rtc_aerial", "major_streets"]
        },
        {
            "name": "Paratransit layers",
            "layers" : ["para_service", "fdr_service","bus_routes","slvr_routes","para_stops"]
        }
    ],
    "projections": [
        {4269: '+proj=longlat +ellps=GRS80 +datum=NAD83 +no_defs '},
        {102707: '+proj=tmerc +lat_0=34.75 +lon_0=-115.5833333333333 +k=0.9999 +x_0=200000.00001016 +y_0=8000000.000010163 +ellps=GRS80 +datum=NAD83 +to_meter=0.3048006096012192 +no_defs '}
    ],
    "highlightStyle": {
        "weight": 2,
        "opacity": 1,
        "color": 'white',
        "dashArray": '3',
        "fillOpacity": 0.5,
        "fillColor": '#E31A1C',
        "stroke": true
    },
    "layers": [
     {
        "id": "rtc_aerial",
        "name": "RTC Aerial (2016)",
        "type": "agsDynamicLayer",
        "url": "http://rtcgis.rtcsnv.com/arcgis/rest/services/Web/PROD_2016_Aerial_Cache/MapServer",
        "layers": [0],
        "format": 'bmp',
        "transparent": true,
        "opacity" : 1,
        "useCors": false,
        "visible": false
     },
     {
        "id": "major_streets",
        "name": "Major Streets",
        "type": "agsDynamicLayer",
        "url": "http://rtcgis.rtcsnv.com/arcgis/rest/services/Web/PROD_WEB_34ServiceArea/MapServer",
        "layers": [2],
        "format": 'png24',
        "transparent": true,
        "opacity" : 1,
        "useCors": false,
        "visible": false,
        "identify": {
            "layerLabel": "Major streets",
            "layerName": "Major Streets",
            "primaryField": "STREET",
            "outFields": [
                {"name": "STRNAME", "alias": "Street name"},
                {"name": "STRDIR", "alias": "Street direction"},
                {"name": "STRTYPE", "alias": "Street type"},
                {"name": "STRCLASS", "alias": "Street class"}
             ],
            "maxAllowableOffset": 0.001
         },

     },
     {
        "id": "para_service",
        "name": "Service Area (Para)",
        "type": "agsDynamicLayer",
        "url": "http://rtcgis.rtcsnv.com/arcgis/rest/services/Web/PROD_ADA_CERT/MapServer/",
        "layers": [3],
        "format": 'png24',
        "transparent": true,
        "opacity" : 0.5,
        //"layerDefs": {3:"POP2000 > 1000000"},
        "useCors": false,
        "visible": false
     },
     {
        "id": "fdr_service",
        "name": "Service Area (FDR)",
        "type": "agsDynamicLayer",
        "url": "http://rtcgis.rtcsnv.com/arcgis/rest/services/Web/PROD_ADA_CERT/MapServer",
        "layers": [4],
        "format": 'png24',
        "transparent": true,
        "opacity" : 0.5,
        // "layerDefs": {3:"POP2000 > 1000000"},
        "useCors": false,
        "visible": false
     },
     {
        "id": "bus_routes",
        "name": "Bus Routes",
        "type": "agsDynamicLayer",
        "url": "http://rtcgis.rtcsnv.com/arcgis/rest/services/Web/PROD_ADA_CERT/MapServer",
        "layers": [2],
        "format": 'png24',
        "transparent": true,
        "opacity" : 0.5,
        // "layerDefs": {3:"POP2000 > 1000000"},
        "useCors": false,
        "visible": false,
        "identify": {
             "layerLabel": "Major streets",
             "layerName": "RTC Bus Routes",
             "primaryField": "ROUTE",
             "outFields": [
                 {"name": "NAME", "alias": "Route Name"}
             ],
             "maxAllowableOffset": 0.001
         },
     },
     {
        "id": "slvr_routes",
        "name": "Silver Start Routes",
        "type": "agsDynamicLayer",
        "url": "http://rtcgis.rtcsnv.com/arcgis/rest/services/Web/PROD_ADA_CERT/MapServer",
        "layers": [1],
        "format": 'png24',
        "transparent": true,
        "opacity" : 0.5,
        // "layerDefs": {3:"POP2000 > 1000000"},
        "useCors": false,
        "visible": false,
        "identify": {
             "layerLabel": "Silver Star Routes",
             "layerName": "Silverstar Routes",
             "primaryField": "ROUTE",
             "outFields": [
                 {"name": "NAME", "alias": "Route Name"},
                 {"name": "SP_MILES", "alias": "Miles"},
                 {"name": "SP_LENGTH", "alias": "Length"}
             ],
             "maxAllowableOffset": 0.001
         },
     },
     {
        "id": "para_stops",
        "name": "ParaTransit Stops",
        "type": "agsFeatureLayer",
        "cluster": true,
        "url": "https://rtcgis.rtcsnv.com/arcgis/rest/services/Web/PROD_BUSSTOPWEB/MapServer/0",
        //"layers": [0],
        // "layerDefs": {3:"POP2000 > 1000000"},
        "useCors": false,
        "visible": false,
        "tooltipField": "StopName",
        "popup": true,
         "outFields": [
             {"name": "StopName", "alias": "Name"},
             {"name": "Stop_Type", "alias": "Type"},
             {"name": "PTSID", "alias": "Stop ID"},
             {"name": "PTSStreetNo", "alias": "Street Number"},
             {"name": "PTSUnitNo",  "alias": "Unit Number"},
             {"name": "Master_Stop_ID",  "alias": "Master Stop ID"},
             {"name": "Stop_Latitude",  "alias": "Latitude "},
             {"name": "Stop_Longitude",  "alias": "Longitude "}
        ],
        "fields": ["StopName","Stop_Type","Bench_Type","PTSID", "PTSStreetNo", "Master_Stop_ID"],
        "style": {
             "stroke": true,
             "fillColor": "#00FFFF",
             "radius": 10,
             "weight": 2,
             "opacity": 1,
             "color": "#FF0000"
        },
        "queryWidget": {
             "layerIndex": 0,
             "maxAllowableOffset": 0.001,
             "queries" : [
                 {"name": "StopName", "alias": "Stop Name"}
             ],
             "outFields": [
                 {"name": "Stop_Type", "alias": "Type"},
                 {"name": "PTSID", "alias": "PTSID"},
                 {"name": "PTSStreetNo", "alias": "PTSStreetNo"},
                 {"name": "PTSUnitNo",  "alias": "PTSUnitNo"},
                 {"name": "Master_Stop_ID",  "alias": "Master_Stop_ID "}
             ]
         }
        }
    ]
}
