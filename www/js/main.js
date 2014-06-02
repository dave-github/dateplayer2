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
        function playAudio(src) {
            // Create Media object from src
            my_media = new Media(src, onSuccess, onError);

            // Play audio
            my_media.play();
			playtime = my_media.getDuration();

            // Update my_media position every second
            if (mediaTimer == null) {
                mediaTimer = setInterval(function() {
                    // get my_media position
                    my_media.getCurrentPosition(
                        // success callback
                        function(position) {
                            if (position > -1) {
                                setAudioPosition((position) + " sec");
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

        // Set audio position
        //
        function setAudioPosition(position) {
            document.getElementById('audio_position').innerHTML = position+":"+playtime;
        }

	
	$( "#select_playlist" ).click(function() {
		var playlist_date = $('#date').val();
		var password = $('#password').val();
		var username = $('#username').val();
		$('#playlist').html('<img src="img/loadingGif.gif" style="width:16px;"> Loading playlist, please wait...');
		$.getJSON( "http://api.ilikemusic.com/linkAPI.php?username="+username+"&password="+password+"&chart_date="+playlist_date+"&chart_position=1&chart_position_ending=20&format=json&type=clips", function( data ) {
			var items = [];
			var html = '<p>Touch the track titles to start listening:</p><ol>';
			$.each( data, function( key, val ) {
				html +='<li>'+key+'. <a href="#">' + val.song_title + ' - ' + val.artist_name + '</a> </li>'+"\n";
				
			});
			 html += '</ol>';
			$('#playlist').html(html);
			
			$('#playlist li').click(function(e) { 
			var i = $(this).index() ;
				$("#playlist li").removeClass("playing");
				$(this).attr({"class":"playing"});
				
				if (my_media) {
					stopAudio();
					my_media.release();
				}
				playAudio("http://api.ilikemusic.com/stream/"+username+"/"+data[i].obfus+"/stream"+i+".mp3");
			});
		});	
	});	
})

