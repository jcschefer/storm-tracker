var DRAW_LINES = true;  // draw the path while the storm is moving
var KEEP_LINES = false;  // keep the lines once the storm has died out

function update( json, map, markers, begin) {
   // 1. find the storms we need to display
   var current = [] ;
   var n = 0 ;
   var t = json[ begin ].time;
   while( begin + n < json.length && json[ begin + n ].time == t )
   {
      current.push( json[ begin + n ] )
      n++;
   }
   
   // 2. remove all markers not being used
   for( m in markers )
   {
      for( var i = 0; i < current.length; i++ )
      {
         var contains = false;
         if( markers[m].storm == current[i].storm )
         {
            contains = true;
         }
      }
      if( !contains )
      {
         if( !KEEP_LINES )
         {
            markers[m].line.setPath([]);
         }
         markers[m].mark.setMap(null);
         delete markers[m];
      }
   }
   
   // 3. update or draw new ones
   for( var i = 0; i < current.length; i++ )
   {
      if( !(i in markers) )
      {
         markers[i] = {
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
               strokeColor: '#FF0000',
               strokeOpacity: 1.0,
               strokeWeight: 2,
               map:map
            }),
            storm: current[i].storm
         } 
      }
      else if( DRAW_LINES )
      {
         var pos = new google.maps.LatLng(current[i].lat, current[i].lon);
         var newp = markers[i].line.getPath();
         newp.push(pos);
         markers[i].line.setPath(newp);
      }
   
      markers[i].mark.setPosition( new google.maps.LatLng( current[i].lat, current[i].lon ));
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

   $.getJSON( 'json_data/1970_time.json', function(json){
      var markers = {};

      var i = 0;
      var refreshId = setInterval( function() { 
         if( i >= json.length )
         {
            clearInterval( refreshId );
            return;
         }

         i = update(json, map, markers, i);
         
      }, 50);

   });
}

function initialize() 
{
   var map_center = new google.maps.LatLng( 21.0, 149.0 );
   var map = new google.maps.Map( document.getElementById( 'mapCanvas' ), {
      zoom: 4,
      center: map_center,
      mapTypeId: google.maps.MapTypeId.ROADMAP
   });
   
   google.maps.event.addListener( map, 'tilesloaded', function(){ track_storms( map ) } );
}

google.maps.event.addDomListener( window, 'load', initialize );

