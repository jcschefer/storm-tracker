var DRAW_LINES = true ;  // draw the path while the storm is moving
var KEEP_LINES = true ;  // keep the lines once the storm has died out
var KEEP_LINE_FOR = new Date();
KEEP_LINE_FOR.setMonth(3);
KEEP_LINE_FOR = KEEP_LINE_FOR.getDate();
var DELAY_MS   = 25   ;

var COLORS = {0:'#FF0000', 1: '#00FF00', 2:'#0000FF', 3:'#FFFF00', 4:'#00FFFF', 5:'#OOOOOO', 6: '#FFFFFF', 7:'#FF00FF', 8:'#0F0F0F', 9:'#aaa1a1'};

var DATAFILE = 'json_data/wp_1970_time.json';

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function update( json, map, markers, begin) {
   // 1. find the storms we need to display
   var current = [] ;
   var n = 0 ;
   var t = json[ begin ].time;
   var curTime = new Date(t);
   curTime = curTime.getDate();
   while( begin + n < json.length && json[ begin + n ].time == t )
   {
      current.push( json[ begin + n ] );
      n++;
   }
   
   // 2. remove all markers not being used
   for(var m in markers )
   {
      var contains = false;
      for(i = 0; i < current.length; i++ )
      {
         contains = false;
         if( markers[m].storm == current[i].storm )
         {
            contains = true;
         }
      }
      if( !contains )
      {
         markers[m].mark.setMap(null);
         if( !KEEP_LINES )
         {
            markers[m].line.setPath([]);
         }
         if(markers[m].time.getDate() - curTime > KEEP_LINE_FOR ) {
            markers[m].line.setPath([]);
            delete markers[m];
            console.log("deleted " + markers[m].storm + " (" + m + ")");
         }
      }
   }
   // 3. update or draw new ones
   for( var i = 0; i < current.length; i++ )
   {
      if( !(current[i].storm in markers) )
      {
         markers[current[i].storm] = {
            mark: new google.maps.Marker({
                  position: new google.maps.LatLng( 0.0, 0.0 ),
                  map: map,
                  title: current[i].storm.toString(),
                  icon:{
                     url: 'icon.svg'
                  }
               }),
            line: new google.maps.Polyline({
               path: [],
               // strokeColor: COLORS[current[i].time.substring(3,4)],
               strokeColor: rgbToHex(current[i].speed * 3, current[i].speed * 3, current[i].speed * 3),
               strokeOpacity: 1.0,
               strokeWeight: 4,
               map: map
            }),
            storm: current[i].storm,
            time: new Date(current[i].time)
         }
         console.log("made new storm at " + current[i].storm)
      }
      if( DRAW_LINES )
      {
         var pos = new google.maps.LatLng(current[i].lat, current[i].lon);
         var newp = markers[current[i].storm].line.getPath();
         newp.push(pos);
         markers[current[i].storm].line.setPath(newp);
      }
   
      markers[current[i].storm].mark.setPosition( new google.maps.LatLng( current[i].lat, current[i].lon ));
   }
   
   return begin + n;
}


function track_storms( map )
{
   $.ajaxSetup( { beforeSend: function(xhr){
      if( xhr.overrideMimeType )
      {
         xhr.overrideMimeType( 'application/json' );
      }
   }});

   $.getJSON( DATAFILE, function(json){
      var markers = {};

      var i = 0;
      var refreshId = setInterval( function() { 
         if( i >= json.length )
         {
            clearInterval( refreshId );
            return;
         }

         i = update(json, map, markers, i);
         
      }, DELAY_MS );

   });
}

function initialize() 
{
   var map_center = new google.maps.LatLng( 21.0, 149.0 );       // to use for west pacific
   //var map_center = new google.maps.LatLng( 0.0, 0.0 );        // to use for world view
   var map = new google.maps.Map( document.getElementById( 'mapCanvas' ), {
      zoom: 4,
      center: map_center,
      mapTypeId: google.maps.MapTypeId.ROADMAP
   });
   
   google.maps.event.addListener( map, 'tilesloaded', function(){ 
      track_storms( map );
   });
}

google.maps.event.addDomListener( window, 'load', initialize );

