// Enter your custom JavaScript code here
var $vSelect = $('#vehWidgetOperator');
var vSelectData = '';
//var marker;
var markers = [];
var idMarker;
var rtMarker;
var group;
var ctable;
var realtime;
var vUrl;
var cfeatureId;

/**************************************************************************************************/
// MISC FUNCTIONS
/**************************************************************************************************/


/**************************************************************************************************/
// MAP FUNCTIONS
/**************************************************************************************************/
function highlightMarker(rLat,rLon,rad) {

    if(idMarker) {
        bootleaf.map.removeLayer(idMarker);

        var latLng = L.latLng([rLat,rLon]);
        var point = bootleaf.map.latLngToContainerPoint(latLng);
        var newPoint = L.point([point.x - 7, point.y - 20]);
        var newLatLng = bootleaf.map.containerPointToLatLng(newPoint);

        idMarker = L.circle(newLatLng,{radius: rad, color: 'yellow'}).addTo(bootleaf.map);
    } else {
        idMarker = L.circle([rLat,rLon],{radius: rad, color: 'yellow'}).addTo(bootleaf.map);
    }


}

function clearAllLayers () {
    if(group) {
        bootleaf.map.removeLayer(group);
    }
    // clear circle id marker
    if(idMarker) {
        bootleaf.map.removeLayer(idMarker);
        idMarker = '';
    }
    if(rtMarker) {
        bootleaf.map.removeLayer(rtMarker);
        realtime.stop();
    }
}

function mapSetView(rLat,rLon,rZoom) {

    bootleaf.map.flyTo([rLat,rLon],rZoom);
}

/**************************************************************************************************/
// VEHICLE REAL TOOL START
/**************************************************************************************************/

function configureVehicleList(){

    switchOffTools();
    bootleaf.activeTool = "real";
    clearAllLayers();
    var querySource = $("#real-template").html();
    bootleaf.realtemplate = Handlebars.compile(querySource);
    resetSidebar("Vehicles List",querySource);


    $("#sidebar").show("slow");

    // poplate sidebar

    var vUrl = "http://rtcdatasrv.rtc.com/paraLeaf/paraPass.cfc?method=getParaVehicleIds";

    // start building our list

    var vlist = '<p><span class="info">Click on a vehicle to track real time</span></p> <input class="form-control" id="myInput" type="text" placeholder="Search list.."><div class="list-group" id="myList">'

    $.getJSON(vUrl, function(data){

        $.each(data.aaData, function (key, item) {
            vlist += '<a href="#" class="list-group-item">' + item.VEHICLENUMBER + '<span class="badge" data-toggle="tooltip" title="Log In Time">'+item.LOGINTIME+'</span></a>';
        })
        vlist += '</div>';

        $("#frmRealGrp").html(vlist);


        $('.list-group-item').on('click', function () {
            var listArray = $(this).text().split(" ");
            console.log(listArray);
            var mdtid = listArray[0];
            if (typeof realtime != 'undefined') {
                realtime.stop();
                setGeoJSONUrl(mdtid);
                console.log(vUrl);
                startVehicleReal();
            } else {
                setGeoJSONUrl(mdtid);
                startVehicleReal();
            }
        })

    })

}

function setGeoJSONUrl(mdtid) {
    vUrl = "http://rtcdatasrv.rtc.com/paraLeaf/paraPass.cfc?method=getParaVehicleCurrent&mdtid=" + mdtid;
    $.growl.notice({title: "Real Time Tracker", message: "Now tracking vehicle " + mdtid,location: 'bc'});
}

function startVehicleReal() {

    var busIcon = L.icon({
        iconUrl: 'img/bus.png',
        iconSize: [32, 37],
        iconAnchor: [22, 38],
        popupAnchor: [-3, -30]
    });

    realtime = L.realtime({
        url: vUrl,
        crossOrigin: true,
        type: 'json',
        start: false
    },{
        interval: 3 * 1000,
        getFeatureId: function(featureData){
            cfeatureId = featureData.properties.id;
            return featureData.properties.id;
        },
        pointToLayer: function(feature,latlng) {
           rtMarker =  L.marker(latlng, {icon: busIcon,title: feature.properties.id});
           return rtMarker;
       }
    });

    realtime.addTo(bootleaf.map)

    realtime.on('update', function() {
        bootleaf.map.fitBounds(realtime.getBounds(), {maxZoom: 17});
        var featureArray = realtime.getFeature(cfeatureId);
        var tUrl = "http://rtcdatasrv.rtc.com/paraLeaf/paraPass.cfc?method=getVehicleNext&vehicle=" + featureArray.properties.id;
        var puContent;
        // get next vehicle information
        $.getJSON(tUrl, function(data){
            console.log(data.aaData[0].CLIENTID);
            puContent = '<strong>Vehicle:</strong> ' + featureArray.properties.id + '</br><strong>Driver: </strong> ' +data.aaData[0].DRIVERID+ '</br><strong>Speed:</strong> ' + featureArray.properties.speed + '</br><strong>Direction:</strong> ' + featureArray.properties.dir + '</br><strong>Next Client: </strong> ' +data.aaData[0].CLIENTID +  '</br><strong>Next Location: </strong> ' +data.aaData[0].STREETNO + ' ' + data.aaData[0].ONSTREET + ' ('+data.aaData[0].ADDRTYPE+')</br><strong>ETA: </strong>' + data.aaData[0].ESTTIMEDISP + '</br><strong>Pass OnBoard: </strong> ' + data.aaData[0].PASSONBOARD + '</br><strong>Space OnBoard: </strong> ' + data.aaData[0].SPACEONBOARD;
            rtMarker.bindPopup(puContent);
        });



    });


}

/**************************************************************************************************/
// FIND VEHICLE TOOL START
/**************************************************************************************************/
function configureVehicleTool(){

    switchOffTools();
    bootleaf.activeTool = "vehicles";
    // clear all layers
    clearAllLayers();
    var querySource = $("#veh-template").html();
    bootleaf.vehtemplate = Handlebars.compile(querySource);
    resetSidebar("Vehicle History",querySource);
    $("#sidebar").show("slow");
    // get para vehicle list
    $vSelect.empty();
    var vUrl = "http://rtcdatasrv.rtc.com/paraLeaf/paraPass.cfc?method=getParaVehicles";

    $.getJSON(vUrl, function(data){

        $.each(data.aaData, function (key, item) {

            var optStr = '<option value="' + item.VEHICLENAME + '">'+item.VEHICLENAME+'</option>';
            $('#vehWidgetOperator').append(optStr);
        })
    })
}

/**************************************************************************************************/
// FIND CLIENT TRIPS TOOL START
/**************************************************************************************************/
function configureCustomerTool(){
    switchOffTools();
    bootleaf.activeTool = "customer";
    // clear all layers

    clearAllLayers();
    $("#ajaxLoading").show();
    var querySource = $("#cust-template").html();
    bootleaf.custtemplate = Handlebars.compile(querySource);
    resetSidebar("Client History",querySource);
    $("#sidebar").show("slow");

    $('#custWidgetOperator').autocomplete({
        source: function (request, response) {
            $.getJSON("http://rtcdatasrv.rtc.com/paraLeaf/paraPass.cfc?method=getParaClients&term="+request.term, function (data) {
                response($.map(data.aaData, function (value, key) {
                    return {
                        label: value.LASTNAME + ',' + value.FIRSTNAME,
                        value: value.CLIENTID
                    };
                }));
            });
        },
        minLength: 2,
        delay: 100
    });


}

function beforeMapLoads(){

    // // This function is called before the map loads, and is useful for manipulating the config object, eg
    // // to add a new custom layer.

    // // Create a layer which is based on a query string in the URL - this shows the US state based on the query
    // // value, eg bootleaf.html/?query=california
    // var statesConfig = {
    //     "id": "us_states",
    //     "name": "States",
    //     "type": "agsDynamicLayer",
    //     "url": "http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer/",
    //     "layers": [5],
    //     "useCors": false,
    //     "visible": true
    // }

    // var query = getURLParameter('query');
    // if(query) {
    //     statesConfig.layerDefs = "5: STATE_NAME = '" + query + "'";
    //     statesConfig.name += " (" + query + ")";
    // }

    // // Add this layer to the TOC and map.
    // config.layers.push(statesConfig);
    // for (i in config.tocCategories){
    //     if (config.tocCategories[i]['name'] === 'ArcGIS Layers') {
    //         config.tocCategories[i]['layers'].push(statesConfig.id);
    //     }
    // }

    // // If there are any layers defined in the URL, add this layer to the list so it draws by default
    // if(bootleaf.layerParams.length > 0){
    //     bootleaf.layerParams.push(statesConfig.id);
    // }



}

function afterMapLoads(){
    // This function is run after the map has loaded. It gives access to bootleaf.map, bootleaf.TOCcontrol, etc

    // Check to see whether the Gray basemap is chosen, and the user has zoomed in too far. In this case,
    // switch to the Streets basemap
    bootleaf.map.on("zoomend", function(evt){
        if (bootleaf.currentBasemap === 'Gray'){
            if (evt.target._zoom >= 17) {
                setBasemap({"type": 'esri', "id": 'Streets'});
                $.growl.warning({ title: "Basemap change", message: "The grayscale basemap is not available at this scale"});
            }
        }
    });

    // Detect the coordinates of the address returned by the geocoder. This can be used elsewhere as required
    bootleaf.leafletGeocoder.on("markgeocode", function(evt){
        console.log("Coordinates: ", evt.geocode.center.lat, ", ", evt.geocode.center.lng);
    });

}

/**************************************************************************************************/
// VEHICLE HISTORY START
/**************************************************************************************************/

function initVehQueryTable() {
    $("#vqueryResults").html('<span id="ajaxLoading"></span><table id="tblVQueryResults" class="table table-condensed table-hover"></table><div id="exportButtons"></div>');
}

function doVehQueryTable(data) {

    var vtable = $('#tblVQueryResults').DataTable({
        "data": data.aaData,
        "columns": [
            {"data": "AVL_DATETIME","title": "AVL Time"},
            {"data": "DIRECTION","title": "Direction"},
            {"data": "LATITUDE","title": "Lat"},
            {"data": "LONGITUDE","title": "Lon"}
        ],
        "searching": false,
        "select": true,
        "ordering": false
    });

    $('#tblVQueryResults tbody').on('click', 'tr', function () {

        $('#tblVQueryResults tbody tr').removeClass('selected');
        $(this).addClass('selected');

        var data = vtable.row( this ).data();

        mapSetView(data["LATITUDE"],data["LONGITUDE"],19);
        highlightMarker(data["LATITUDE"],data["LONGITUDE"],7);
    });

}

function runVehicleWidget() {

    // init data table
    initVehQueryTable();

    // set up icon

    var busIcon = L.icon({
        iconUrl: 'img/bus.png',
        iconSize: [32, 37],
        iconAnchor: [22, 38],
        popupAnchor: [-3, -30]
    });

    //get data to send
    var vDate = $('#vehWidgetValue1').val();
    var sTime = $('#vehWidgetValue2').val();
    var eTime = $('#vehWidgetValue3').val();
    var vehId = $('#vehWidgetOperator').val();

    if(vDate == '' || sTime == '' || eTime == '' || vehId == '') {
        $.growl.warning({ message: "some vehicle history data was not entered "});
    } else {
        var dataStr = '&vdate='+vDate+'&sTime='+sTime+'&eTime='+eTime+'&vehid='+vehId;

        var locUrl = "http://rtcdatasrv.rtc.com/paraLeaf/paraPass.cfc?method=getParaVehiclesLocations" + dataStr;
        var markers = [];
        $.getJSON(locUrl, function(data){
            if(data.aaData.length) {
                $.each(data.aaData, function (key, item) {
                    console.log(key);
                    var puStr = "<strong>MDT Id:</strong> " + item.MDTID + "<br><strong> Direction:</strong> " + item.DIRECTION + "<br><strong> Speed:</strong> " + item.SPEEDMPH + " MPH<br><strong> AVL Time:</strong> " + item.AVL_DATETIME;

                    marker = L.marker([item.LATITUDE,item.LONGITUDE], {title: item.MDTID,icon: busIcon,id:key}).bindPopup(L.popup({maxWidth:500}).setContent(puStr));
                    markers.push(marker);
                })

                group = L.featureGroup(markers).addTo(bootleaf.map);
                var bounds = group.getBounds();
                bootleaf.map.fitBounds(bounds);
                doVehQueryTable(data);
            } else {
                $.growl.warning({message: "No AVL data found for this time period and vehicle!"});
            }
        })

    }


}

/**************************************************************************************************/
// CLIENT HISTORY START
/**************************************************************************************************/

function format ( d ) {
    return '<strong>Scheduled Time</strong>: '+d.SCHEDULE_TIME+'<br>' +
        '<strong>Pick Up Arrive</strong>:   '+d.PU_ARRIVE_TIME+'&nbsp;<strong> | Pick Up Depart</strong>: '+d.PU_DEPART_TIME+'<br>'+
        '<strong>Drop Off Arrive</strong>: '+d.DO_ARRIVE_TIME+'<strong> | Drop Off Depart</strong>:'+d.DO_DEPART_TIME+'<br>'
}

function initCliQueryTable() {
    $("#cqueryResults").html('<span id="ajaxLoading"></span><table id="tblCQueryResults" class="table table-condensed table-hover"></table><div id="exportButtons"></div>');
}

function doCliQueryTable(data) {

  ctable = $('#tblCQueryResults').DataTable({
        "data": data.aaData,
        "columns": [
            {
                "class": "details-control",
                "orderable": false,
                "data": null,
                "defaultContent": ""
            },
            {"data": "VEHICLE","title": "Vehicle"},
            {"data": "RUNNUMBER","title": "Run"},
            {"data": "PU_ADDRESS","title": "PU At"},
            {"data": "DO_ADDRESS","title": "DO At"}
        ],
        "searching": false,
        "select": true,
        "ordering": false
    });

    $('#tblCQueryResults tbody').on('click', 'tr', function () {

        $('#tblCQueryResults tbody tr').removeClass('selected');
        $(this).addClass('selected');

        var data = ctable.row( this ).data();

       // mapSetView(data["LATITUDE"],data["LONGITUDE"],19);
       // highlightMarker(data["LATITUDE"],data["LONGITUDE"],7);
    });

    var detailRows = [];

    $('#tblCQueryResults tbody').on( 'click', 'tr td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = ctable.row( tr );
        var idx = $.inArray( tr.attr('id'), detailRows );

        if ( row.child.isShown() ) {
            tr.removeClass( 'details' );
            row.child.hide();

            // Remove from the 'open' array
            detailRows.splice( idx, 1 );
        }
        else {
            tr.addClass( 'details' );
            row.child( format( row.data() ) ).show();

            // Add to the 'open' array
            if ( idx === -1 ) {
                detailRows.push( tr.attr('id') );
            }
        }
    } );

    // On each draw, loop over the `detailRows` array and show any child rows
    ctable.on( 'draw', function () {
        $.each( detailRows, function ( i, id ) {
            $('#'+id+' td.details-control').trigger( 'click' );
        } );
    } );

}


function runClientWidget() {
    clearAllLayers();
    // init client table
    initCliQueryTable();
    //get data to send
    var cDate = $('#custWidgetValue1').val();
    var clientId = $('#custWidgetOperator').val();
    markers = [];
    // set up icon

    var doIcon = L.icon({
        iconUrl: 'img/para_do.png',
        iconSize: [32, 37],
        iconAnchor: [22, 38],
        popupAnchor: [-3, -30]
    });

    var puIcon = L.icon({
        iconUrl: 'img/para_pu.png',
        iconSize: [32, 37],
        iconAnchor: [22, 38],
        popupAnchor: [-3, -30]
    });

    var dataStr = '&cdate='+cDate+'&clientId='+clientId;

    var locUrl = "http://rtcdatasrv.rtc.com/paraLeaf/paraPass.cfc?method=getParaClientTrips" + dataStr;

    $.getJSON(locUrl, function(data){
        var pmarker = [];
        var dmarker = [];
        if(data.aaData.length) {

            $.each(data.aaData, function (key, item) {

                var puStr = "<strong>PICK-UP</strong><br/><strong>Client Id:</strong> " + item.CLIENTID + "<br><strong> VEHICLE:</strong> " + item.VEHICLE + "<br><strong> Scheduled:</strong> " + item.SCHEDULE_TIME + "<br><strong> Arrive:</strong> " + item.PU_ARRIVE_TIME + "<br><strong> Depart:</strong> " + item.PU_DEPART_TIME + "<br><strong> Run:</strong> " + item.RUNNUMBER + "<br><strong> Address:</strong> " + item.PU_ADDRESS;

                var doStr = "<strong>DROP-OFF</strong><br/><strong>Client Id:</strong> " + item.CLIENTID + "<br><strong> VEHICLE:</strong> " + item.VEHICLE + "<br><strong> Scheduled:</strong> " + item.SCHEDULE_TIME + "<br><strong> Arrive:</strong> " + item.DO_ARRIVE_TIME + "<br><strong> Depart:</strong> " + item.DO_DEPART_TIME + "<br><strong> Run:</strong> " + item.RUNNUMBER + "<br><strong> Address:</strong> " + item.DO_ADDRESS;

                var pnt1 = new L.LatLng(item.PU_YCOORD,item.PU_XCOORD);
                var pnt2 = new L.LatLng(item.DO_YCOORD,item.DO_XCOORD);
                //do pickup marker
                pmarker = L.marker(pnt1, {title: item.PU_ADDRESS,icon: puIcon}).bindPopup(L.popup({maxWidth:500}).setContent(puStr));
                markers.push(pmarker);

                //do drop off marker
                dmarker = L.marker(pnt2, {title: item.DO_ADDRESS,icon: doIcon}).bindPopup(L.popup({maxWidth:500}).setContent(doStr));
                markers.push(dmarker);

            })
            console.log(markers);
            group = L.featureGroup(markers).addTo(bootleaf.map);
            var bounds = group.getBounds();
            bootleaf.map.fitBounds(bounds);
            doCliQueryTable(data);
        } else {
            $.growl.warning({message: "No AVL data found for this client on date selected!"});
        }
    })

}




