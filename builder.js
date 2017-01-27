function track_storms( map )
{
   $.ajaxSetup( { beforeSend: function(xhr){
      if( xhr.overrideMimeType )
      {
         xhr.overrideMimeType( 'application/json' );
      }
   }});

   $.getJSON( 'json_data/1970.json', function(json){
      var markers = {};
      console.log(json['1970'][0][0]);
      for( var year in json )
      {
         console.log(year);
         console.log(json[year].length);
         for( var storm_num = 0; storm_num < json[year].length; storm_num++ )
         {
            var unique_index = year + storm_num.toString();
            console.log(unique_index)
            markers[ unique_index ] =  new google.maps.Marker({
               position: new google.maps.LatLng( json[year][storm_num][0].lat, json[year][storm_num][0].lon ),
               map: map,
               title: unique_index,
               icon: {
                  url: 'icon.svg'
               }
            });
            //console.log('loaded 1');
         }
      }
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
   
   var m = new google.maps.Marker({
      position: map_center,
      map: map,
      title: '21 and 149'
   });

   google.maps.event.addListener( map, 'tilesloaded', track_storms );
}

google.maps.event.addDomListener( window, 'load', initialize );

