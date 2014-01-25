var BORDER_SIZE = 20; //size of border for stars not to collide with ui
var SFX_VOLUME = 0.5;

var MIN_COLOR = 180,
    MAX_COLOR = 255; // stars random color settings

var Star = function(){
    var self = document.createElement('div');
    $(self).addClass('star');

    var size = Random.getRandomInt(8, 10);
    $(self).width(size);
    $(self).height(size);

    var x = Random.getRandomInt(size/2 + BORDER_SIZE, $(window).width() - size/2 - BORDER_SIZE);
    var y = Random.getRandomInt(size/2 + BORDER_SIZE, $(window).height() - size/2 - BORDER_SIZE);
    $(self).css({left: x, top: y});

    var colors = [
        Random.getRandomColor(MIN_COLOR, MAX_COLOR),
        Random.getRandomColor(MIN_COLOR, MAX_COLOR),
        Random.getRandomColor(MIN_COLOR, MAX_COLOR)
    ];

    $(self).css({
        background: 'radial-gradient(ellipse at center, rgb(' +
            colors[0].r +', ' +
            colors[0].g +', ' +
            colors[0].b +') ' +
            '0%, rgb(' +
            colors[1].r +', ' +
            colors[1].g +', ' +
            colors[1].b +') ' +
            '50%, rgb(' +
            colors[2].r +', ' +
            colors[2].g +', ' +
            colors[2].b +') ' +
            '100%)',
        boxShadow: '0px 0px ' + Math.round(size*3/2) + 'px rgba(' +
            colors[2].r +', ' +
            colors[2].g +', ' +
            colors[2].b +
            ', 0.9)'
    });

    return self;
}

var blinkStar = function(star) {
    setTimeout(function(){
        $(star).fadeTo(200, 0.5).fadeTo(200, 1.0);
        blinkStar(star);
    }, Random.getRandomInt(1000, 20000));
}

var latestStar;
var addStar = function(options, playNewSound){
    var star = new Star();
    $('.stars').append(star);
    $(star)
        .data('last', true)
        .fadeTo(0, 0)
        .fadeTo(1500, 1);
    blinkStar(star);

    if (options.clickable){

        if (typeof(playNewSound) == "undefined") playNewSound = true;
        if (playNewSound){
            playSound(newStarEffects[effect], SFX_VOLUME);
            effect++;
            if (effect >= newStarEffects.length) effect = 0;
        }

        $(star).click(function(){
            $(this).fadeOut(100, function(){
                $(this).fadeIn(100);
            });
            if ($(star).data('last')){
                $(star).data('last', false);
                starsCounted++;
                updateCounter();
                addStar(options);
            } else {
                mistakesLeft--;
                if (mistakesLeft >=0){
                    playSound(wrongStarEffect, SFX_VOLUME);
                    $($('#mistakes .mistake').get(mistakesLeft)).fadeTo(1000, 0);

                    $(latestStar).data('last', false);
                    addStar(options, false);

                } else {
                    endGame();
                }
            }
        });
    }
    latestStar = star;
}

var endGame = function(){
    $("#bgcover").show();
    $("#menuContent").html(
        $("#gameEnded").html()
    );
    $("#starsCountedEnd").html(
        $("#counterHolder").html()
    );
    $(".gameUI").fadeOut(500);
    $("#mainMenu").fadeIn(500);
    $("#menuContent #tryAgainBtn").click(function(){
        $(this).fadeOut(100, function(){
            $(this).fadeIn(100);
        });

        $("#mainMenu").fadeOut(500, newGame);
    });
}


var newGame = function(){
    $('.stars .star').fadeOut(500, function(){
        $(this).remove();
    });

    starsCounted = 0;
    mistakesLeft = 3;

    updateCounter();
    $("#counterHolder")
        .fadeTo(0, 0)
        .fadeTo(1500, 1);
    updateMistakes()
        .fadeTo(0, 0)
        .fadeTo(1500, 1);

    $('#bgcover').hide();
    addStar({clickable: true});
}

var updateMistakes = function(){
    for (var i = 0; i < mistakesLeft; i++){
        $($('#mistakes .mistake').get(i)).fadeTo(1000, 1);
    }
    return $('#mistakes');
}

var updateCounter = function(){
    var newText;
    if (starsCounted % 10 == 1) {
        newText = starsCounted + " star";
    } else {
        newText = starsCounted + " stars";
    }

    return $('#counter')
        .fadeOut(400, function(){
            $(this)
                .html(newText)
                .fadeIn(400);
        })
}

var playSound = function(filename, volume, callback){
    if (soundEnabled){
        var audio = new Audio();
        currentSounds.push(audio);
        audio.src = filename;
        if (!volume) volume = 1;
        audio.volume = volume;
        audio.load();
        audio.play();
        audio.addEventListener('ended', function(){
            currentSounds.splice(currentSounds.indexOf(audio), 1);
            if (callback){
                callback();
            };
        });
        return audio;
    }
}

var nextSong = function(){
    if (soundEnabled){
        var newSong = Random.getRandomInt(0, songs.length - 1);
        while (newSong == song){
            newSong = Random.getRandomInt(0, songs.length - 1);
        }
        song = newSong;
        musicPlayer.src = songs[song].fileName;
        musicPlayer.load();
        musicPlayer.play();
        $("#nowPlaying").fadeOut(0, function(){
            $(this)
                .html(songs[song].songName)
                .fadeIn(1000);
        });
        setHideTimeout();
    }
}

var setHideTimeout = function(){
    hideSongNameTimeout = setTimeout(function(){
        $("#nowPlaying").fadeOut(1000);
    }, 30000);
}

var starsCounted, mistakesLeft, effect = 0, song = Random.getRandomInt(0, songs.length - 1), soundEnabled = true, hideSongNameTimeout = 0;
var currentSounds = [];
var musicPlayer;
$(document).ready(function(){

    /*var docElm = document.documentElement;
    if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
    }
    else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
    }
    else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
    }*/

    musicPlayer = new Audio();
    musicPlayer.addEventListener('ended', function(){
        nextSong();
    });
    nextSong();

    $("#soundToggle")
        .mouseover(function(){
            if (soundEnabled){
                clearTimeout(hideSongNameTimeout);
                $("#nowPlaying")
                    .fadeIn(1000);
                setHideTimeout();
            }
        })
        .click(function(){
            var newicon;
            if (soundEnabled = !soundEnabled){
                newicon = '<i class="icon-volume-high"></i>';
                nextSong();
            } else {
                clearTimeout(hideSongNameTimeout);
                $("#nowPlaying").fadeOut(1000);
                musicPlayer.pause();
                $.each(currentSounds, function(index, audio){
                    audio.pause();
                });
                currentSounds = [];
                newicon = '<i class="icon-volume-off"></i>';
            }
            $(this).fadeOut(100, function(){
                $(this)
                    .html(newicon)
                    .fadeIn(100);
            })
        });

    for(var i = 0; i < 50; i++) addStar({clickable: false});

    $("#startBtn").click(function(){
        $(this).fadeOut(100, function(){
            $(this).fadeIn(100);
        });

        $("#mainMenu").fadeOut(500, newGame);
    });

    $(document).on('click', '.social_share', function(){
        Share.go(this, {
            text:  "I've counted " + starsCounted + " star" + (starsCounted % 10 == 1 ? "" : "s") + " in \"Count The Stars\" game.",
            image: "http://mad-gooze.github.io/CountTheStarsGame/img/logo.png"
        });
    });
});