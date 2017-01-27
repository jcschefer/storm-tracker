function track_hurricane( map )
{
   
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
      title: '21 and 149',
      icon: {
         url: 'icon.svg',
      }
   });

   //google.maps.event.addListener( map, 'tilesloaded', drawLines( map ) );
}

google.maps.event.addDomListener( window, 'load', initialize );

