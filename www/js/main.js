$('document').ready(function () {
	
	$( "#select_playlist" ).click(function() {
		var playlist_date = $('#date').val();
		var password = $('#password').val();
		var username = $('#username').val();
		
		$.getJSON( "http://api.ilikemusic.com/linkAPI.php?username="+username+"&password="+password+"&chart_date="+playlist_date+"&chart_position=1&chart_position_ending=20&format=json&type=clips", function( data ) {
			var items = [];
			var html = '<ul>';
			$.each( data, function( key, val ) {
				html +='<li><a href="#">' + val.song_title + ' - ' + val.artist_name + '</a></li>'+"\n";
				
				$('#player').append('<source src="http://api.ilikemusic.com/stream/'+username+'/'+val.obfus+'/stream'+key+'.mp3" type="audio/mpeg">'+"\n");
			});
			 html += '</ul>';
			$('#playlist').html(html);
			
				$('#playlist li').click(function(e) { 
			
			alert('hi');
			var i = $(this).index() ;
			$('#player').attr({
				"src":'http://api.ilikemusic.com/stream/'+username+'/'+data[i].obfus+'/stream'+i+'.mp3',
				"autoplay": "autoplay"
				});
				$("#playlist li").removeClass("playing");
				$(this).attr({"class":"playing"});
				stopAudio();
				playAudio("http://api.ilikemusic.com/stream/"+username+"/"+data[i].obfus+"/stream"+i+".mp3");
			});
				
			
		});	
	});	
	

})
