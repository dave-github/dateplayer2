$('document').ready(function () {

	 // Wait for device API libraries to load
        //
        document.addEventListener("deviceready", onDeviceReady, false);

        // device APIs are available
        //
        function onDeviceReady() {
            //playAudio("http://audio.ibeat.org/content/p1rj1s/p1rj1s_-_rockGuitar.mp3");
        }

        // Audio player
        //
        var my_media = null;
        var mediaTimer = null;
		var playtime = null;
        // Play audio
        //
        function playAudio(src,data,i) {
            // Create Media object from src
            my_media = new Media(src, onSuccess, onError, onStatus);

            // Play audio
            my_media.play();
			playtime = my_media.getDuration();
			
			

            // Update my_media position every second
            if (mediaTimer == null) {
                mediaTimer = setInterval(function() {
				
					var dur = my_media.getDuration();
						
				
                    // get my_media position
                    my_media.getCurrentPosition(
                        // success callback
                        function(position) {
                            if (position > -1) {
                                setAudioPosition(Math.floor(position) , Math.floor(dur));
                            }
                        },
                        // error callback
                        function(e) {
                            console.log("Error getting pos=" + e);
                            setAudioPosition("Error: " + e);
                        }
                    );
                }, 1000);
            }
        }

        // Pause audio
        //
        function pauseAudio() {
            if (my_media) {
                my_media.pause();
            }
        }

        // Stop audio
        //
        function stopAudio() {
            if (my_media) {
                my_media.stop();
            }
            clearInterval(mediaTimer);
            mediaTimer = null;
        }

        // onSuccess Callback
        //
        function onSuccess() {
            console.log("playAudio():Audio Success");
        }

        // onError Callback
        //
        function onError(error) {
		//stopAudio();
		/*
            alert('code: '    + error.code    + '\n' +
                  'message: ' + error.message + '\n');*/
        }
		
		function onStatus(param) {
		//stopAudio();
		
            
			if(param==4) {
			alert('status: '    + param    + '\n');
				i++;
				alert(i);
				alert(items);
				playAudio("http://api.ilikemusic.com/stream/"+username+"/"+data[i].obfus+"/stream"+i+".mp3");
			
			}
        }

        // Set audio position
        //
        function setAudioPosition(position,dur) {
            document.getElementById('audio_position').innerHTML = position+"/"+dur+" secs";
        }

	
	$( "#select_playlist" ).click(function() {
		buildPlaylist();
		
	});	
	
	
	function getPlaylistData() {
		var playlist_date = $('#date').val();
		var password = $('#password').val();
		var username = $('#username').val();
		var rand = Math.random().toString(36).substr(2);
	
	}
	
	function buildPlaylist() {
	
		var playlist_date = $('#date').val();
		var password = $('#password').val();
		var username = $('#username').val();
		var rand = Math.random().toString(36).substr(2);
		
		$('#playlist').html('<img src="img/loadingGif.gif" style="width:16px;"> Loading playlist, please wait...');
		$.getJSON( "http://api.ilikemusic.com/linkAPI.php?username="+username+"&password="+password+"&chart_date="+playlist_date+"&chart_position=1&chart_position_ending=20&format=json&type=clips&ref="+rand, function( data ) {
			var items = [];
			var html = '<p>Touch the track titles to start listening:</p><ol>';
			$.each( data, function( key, val ) {
				html +='<li><img src="http://api.ilikemusic.com/image/'+username+'/'+val.obfus+'/image.jpg"><p>'+(key+1)+'. <strong>' + val.song_title + '</strong><br><i>' + val.artist_name + '</i></p> </li>'+"\n";
				
			});
			 html += '</ol>';
			$('#playlist').html(html);
			
			$('#playlist li').click(function(e) { 
			var i = $(this).index();
				$("#playlist li").removeClass("playing");
				$(this).attr({"class":"playing"});
				
				if (my_media) {
					stopAudio();
					my_media.release();
				}
				playAudio("http://api.ilikemusic.com/stream/"+username+"/"+data[i].obfus+"/stream"+i+".mp3",data,i);
			});
		});	
	
	}
	
	$('#pause_button').click(function(e) {
	
		my_media.pause();
	
	});
	
	$('#play_button').click(function(e) {
	
		my_media.play();
	
	});
	
	$('#search_form').on('submit', function(event) {
		event.preventDefault(); // cancel default form submit
		
		buildPlaylist();
		return false;
	});
	

	
})

