var stage, slidesContainer, projectsGridContainer;

var  projectTitle, projectView;

var heightWidthPercent = ["100%"];

var defaultTopValue;

var dontScroll = false;

var imageResolutions = [[1900, 1266.7], [1950, 1023.75], [1920, 1080], [1850, 1156.25], [2048, 1216], [1968, 1010], [1920, 1080] ,[1850, 1098.44] ,[1830, 1285.47] ,[1850, 1040.6]];
// var mobileResolutions = [[1000, 666.7], [1950, 1023.75], [1920, 1080], [1800, 1125], [2048, 1216], [1968, 1010], [1920, 1080] ,[1800, 1068.75] ,[1800, 1246.4] ,[1800, 1012.55]];
var projectTitles = ['Emmit Fenn by Active Theory', 'Taiga by Matt & Mélissa', 'Konterball by Wild', 'In Pieces by Bryan James', 'Mr Nom Nom by Etter Studio', 'Pablo the Flamingo by Nathan Gordon', 'Audible Visuals by Sonia Boller', 'Monument Valley by ustwo games', 'Musical Forest by Google Creative Lab', 'Prune by Joel Mcdonald'];
var shortenedProjectTitles = ['Emmit Fenn', 'Taiga', 'Konterball', 'In Pieces', 'Mr Nom Nom', 'Pablo the Flamingo', 'Audible Visuals', 'Monument Valley', 'Musical Forest', 'Prune'];
var videoUrls = ['https://www.youtube.com/watch?v=5Y-eYzjb5BI', 'https://vimeo.com/251206343', 'https://www.youtube.com/watch?v=06fjUwhSTf8', 'https://vimeo.com/123602667', 'https://www.youtube.com/watch?v=XOKZ1tOevF0', '', '', 'https://www.youtube.com/watch?v=tW2KUxyq8Vg', 'https://www.youtube.com/watch?v=RIpob33uUEU', 'https://www.youtube.com/watch?v=sfq7xXQlNOI']
var websiteLinks = ['https://emmitfenn.com/', 'https://christmasexperiments.com/2017/19/taiga/', 'https://konterball.com/', 'http://www.species-in-pieces.com/','https://mrnmnm.com/', 'http://pablotheflamingo.com/', 'https://soniaboller.github.io/audible-visuals/', 'https://www.monumentvalleygame.com/', 'https://forest.webvrexperiments.com/', 'http://www.prunegame.com/']

window.CanvasSlideshow = function( options ) {

  var that  =   this;

  $("#video-link").attr("href", videoUrls[0]);
  $("#website-link").attr("href", websiteLinks[0]);

  //  OPTIONS
  /// ---------------------------      
  options                     = options || {};
  options.stageWidth          = options.hasOwnProperty('stageWidth') ? options.stageWidth : 2250;
  options.stageHeight         = options.hasOwnProperty('stageHeight') ? options.stageHeight : 1550;
  options.pixiSprites         = options.hasOwnProperty('sprites') ? options.sprites : [];
  options.centerSprites       = options.hasOwnProperty('centerSprites') ? options.centerSprites : true;
  options.autoPlay            = options.hasOwnProperty('autoPlay') ? options.autoPlay : true;
  options.autoPlaySpeed       = options.hasOwnProperty('autoPlaySpeed') ? options.autoPlaySpeed : [10, 3];
  options.fullScreen          = options.hasOwnProperty('fullScreen') ? options.fullScreen : true;
  options.displaceScale       = options.hasOwnProperty('displaceScale') ? options.displaceScale : [200, 70];
  options.displacementImage   = options.hasOwnProperty('displacementImage') ? options.displacementImage : '';
  options.wacky               = options.hasOwnProperty('wacky') ? options.wacky : false;
  options.displaceScaleTo     = ( options.autoPlay === false ) ? [ 0, 0 ] : [ 20, 20 ];
  options.displacementCenter  = options.hasOwnProperty('displacementCenter') ? options.displacementCenter : false;
 
  // var renderer = new PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {transparent: true});
  var renderer = new PIXI.autoDetectRenderer(1680, 976, {transparent: true});
  
  stage = new PIXI.Container();
  slidesContainer = new PIXI.Container();
  projectsGridContainer = new PIXI.Container();
  var displacementSprite = new PIXI.Sprite.fromImage( options.displacementImage );
  var displacementFilter = new PIXI.filters.DisplacementFilter( displacementSprite );

  projectView = document.getElementById('project-view');
  projectTitle = document.getElementById('project-title')
  

  //  SLIDES ARRAY INDEX
  /// ---------------------------    
  this.currentIndex = 0;

  defaultTopValue = document.getElementById('project-view').style.top ;

  makeAdjustments();

  /// ---------------------------
  //  INITIALISE PIXI
  /// ---------------------------      
  this.initPixi = function() {
    document.getElementById("canvas").appendChild( renderer.view );

    // Add child container to the main container 
    stage.addChild( slidesContainer );
  
    // Fit renderer to the screen
    if ( options.fullScreen === true ) {
      renderer.view.style.objectFit = 'cover';
      renderer.view.style.width     = '100%';
      renderer.view.style.height    = '100%';
      renderer.view.style.top       = '50%';
      renderer.view.style.left      = '50%';
      renderer.view.style.webkitTransform = 'translate( -50%, -50% ) scale(1)';           
      renderer.view.style.transform = 'translate( -50%, -50% ) scale(1)';           
    } else {
      renderer.view.style.maxWidth  = '100%';
      renderer.view.style.top       = '50%';
      renderer.view.style.left      = '50%';
      renderer.view.style.webkitTransform = 'translate( -50%, -50% )';           
      renderer.view.style.transform = 'translate( -50%, -50% )';          
    }
    
    displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;

    // Set the filter to stage and set some default values for the animation
    stage.filters = [displacementFilter];        

    if ( options.autoPlay === false ) {
      displacementFilter.scale.x = 0;
      displacementFilter.scale.y = 0;
    }

    if ( options.wacky === true ) {

      displacementSprite.anchor.set(0.5);
      displacementSprite.x = renderer.width / 2;
      displacementSprite.y = renderer.height / 2; 
    }

    displacementSprite.scale.x = 2;
    displacementSprite.scale.y = 2;

    // PIXI tries to fit the filter bounding box to the renderer so we optionally bypass
    displacementFilter.autoFit = options.displaceAutoFit;
    
    stage.addChild( displacementSprite );

  };

  /// ---------------------------
  //  LOAD SLIDES TO CANVAS
  /// ---------------------------          
  this.loadPixiSprites = function( sprites ) {
    var rSprites = options.sprites;
    
    for ( var i = 0; i < rSprites.length; i++ ) {
      
      var texture   = new PIXI.Texture.fromImage( sprites[i] );
      var image     = new PIXI.Sprite( texture );

      image.width = imageResolutions[i][0];
      image.height = imageResolutions[i][1];
      
      if ( options.centerSprites === true ) {
        image.anchor.set(0.5);
        image.x = renderer.width / 2;
        image.y = renderer.height / 2;            
      }
      
      if ( i !== 0  ) {
        TweenMax.set( image, { alpha: 0 } );
      }

      slidesContainer.addChild(image);
    } 
    
  };

  /// ---------------------------
  //  DEFAULT RENDER/ANIMATION
  /// ---------------------------        
  if ( options.autoPlay === true ) {

    var ticker = new PIXI.ticker.Ticker();

    ticker.autoStart = options.autoPlay;

    ticker.add(function( delta ) {   
      displacementSprite.x += options.autoPlaySpeed[0] * delta;
      displacementSprite.y += options.autoPlaySpeed[1];
      
      renderer.render( stage );
    });

  }  
  else {

      var render = new PIXI.ticker.Ticker();

      render.autoStart = true;

      render.add(function( delta ) {
        renderer.render( stage );
      });        
  }    
  
  /// ---------------------------
  //  TRANSITION BETWEEN SLIDES
  /// ---------------------------    
  var isPlaying   = false;  
  var slideImages = slidesContainer.children;    
  this.moveSlider = function( newIndex ) {
    isPlaying = true;
    var baseTimeline = new TimelineMax( { onComplete: function () {
      that.currentIndex = newIndex;
      isPlaying = false;
      if ( options.wacky === true ) {
        displacementSprite.scale.set( 1 );
      }          
     },onUpdate: function() {
      
        if ( options.wacky === true ) {
          displacementSprite.rotation += baseTimeline.progress() * 0.02;      
          displacementSprite.scale.set( baseTimeline.progress() * 3 );
        }
  
    } });
    
    baseTimeline.clear();
 
    if ( baseTimeline.isActive() ) {
      return;
    }  

    $("#video-link").attr("href", videoUrls[newIndex]);
    $("#website-link").attr("href", websiteLinks[newIndex]);

    baseTimeline
      .to(displacementFilter.scale, 1, { x: options.displaceScale[0], y: options.displaceScale[1]  })
      .to(slideImages[that.currentIndex], 0.5, { alpha: 0, onComplete: function(){
          
        if(videoUrls[newIndex] == ''){
          document.getElementById('video-link').style.display = 'none';
          document.getElementById('divider').style.display = 'none';
        }
        else{
          document.getElementById('video-link').style.display = 'inline-block';
          document.getElementById('divider').style.display = 'inline-block';
        }

        that.currentIndex = newIndex;
        makeAdjustments();
        document.getElementById('counter-num').innerHTML = (newIndex < 9)? '0' + (newIndex + 1) : newIndex + 1;

        TweenMax .to(slideImages[newIndex], 0.5, { alpha: 1 });
        TweenMax .to(displacementFilter.scale, 1, { x: options.displaceScaleTo[0], y: options.displaceScaleTo[1] } );
      }})
      .to(slideImages[newIndex], 0.5, { alpha: 1 })          
      .to(displacementFilter.scale, 1, { x: options.displaceScaleTo[0], y: options.displaceScaleTo[1] } );

  };

  /// ---------------------------
  //  INIT FUNCTIONS
  /// ---------------------------    

  this.init = function() {
    that.initPixi();
    that.loadPixiSprites( options.pixiSprites );
  };

  
  /// ---------------------------
  //  INTERACTIONS
  /// ---------------------------
  function rotateSpite() {
    displacementSprite.rotation += 0.001;
    rafID = requestAnimationFrame( rotateSpite );
  }
  
  /// ---------------------------
  //  CENTER DISPLACEMENT
  /// ---------------------------
  if ( options.displacementCenter === true ) {
    displacementSprite.anchor.set(0.5);
    displacementSprite.x = renderer.view.width / 2;
    displacementSprite.y = renderer.view.height / 2;        
  }
  
  
  /// ---------------------------
  //  START 
  /// ---------------------------           
  this.init();

  
  /// ---------------------------
  //  HELPER FUNCTIONS
  /// ---------------------------
  function scaleToWindow( canvas, backgroundColor ) {
    var scaleX, scaleY, scale, center;
  
    //1. Scale the canvas to the correct size
    //Figure out the scale amount on each axis
    scaleX = window.innerWidth / canvas.offsetWidth;
    scaleY = window.innerHeight / canvas.offsetHeight;
  
    //Scale the canvas based on whichever value is less: `scaleX` or `scaleY`
    scale = Math.min(scaleX, scaleY);
    canvas.style.transformOrigin = "0 0";
    canvas.style.transform = "scale(" + scale + ")";
  
    //2. Center the canvas.
    //Decide whether to center the canvas vertically or horizontally.
    //Wide canvases should be centered vertically, and 
    //square or tall canvases should be centered horizontally
    if (canvas.offsetWidth > canvas.offsetHeight) {
      if (canvas.offsetWidth * scale < window.innerWidth) {
        center = "horizontally";
      } else {
        center = "vertically";
      }
    } else {
      if (canvas.offsetHeight * scale < window.innerHeight) {
        center = "vertically";
      } else {
        center = "horizontally";
      }
    }
  
    //Center horizontally (for square or tall canvases)
    var margin;
    if (center === "horizontally") {
      margin = (window.innerWidth - canvas.offsetWidth * scale) / 2;
      canvas.style.marginTop = 0 + "px";
      canvas.style.marginBottom = 0 + "px";
      canvas.style.marginLeft = margin + "px";
      canvas.style.marginRight = margin + "px";
    }
  
    //Center vertically (for wide canvases) 
    if (center === "vertically") {
      margin = (window.innerHeight - canvas.offsetHeight * scale) / 2;
      canvas.style.marginTop = margin + "px";
      canvas.style.marginBottom = margin + "px";
      canvas.style.marginLeft = 0 + "px";
      canvas.style.marginRight = 0 + "px";
    }
  
    //3. Remove any padding from the canvas  and body and set the canvas
    //display style to "block"
    canvas.style.paddingLeft = 0 + "px";
    canvas.style.paddingRight = 0 + "px";
    canvas.style.paddingTop = 0 + "px";
    canvas.style.paddingBottom = 0 + "px";
    canvas.style.display = "block";
  
    //4. Set the color of the HTML body background
    document.body.style.backgroundColor = backgroundColor;
  
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("safari") != -1) {
      if (ua.indexOf("chrome") > -1) {
        // Chrome
      } else {
        // Safari
        canvas.style.maxHeight = "100%";
        canvas.style.minHeight = "100%";
      }
    }

    return scale;
  }   
 
  window.addEventListener("wheel", function(e){
    if(isPlaying || dontScroll){
      return;
    }

    if(e.wheelDeltaY < -40){
      if(that.currentIndex == slideImages.length - 1){
        that.moveSlider(0);
        return;
      }
      that.moveSlider( that.currentIndex + 1 );
      
    }
    else if(e.wheelDeltaY > 40){
      if(that.currentIndex == 0){
        that.moveSlider(slideImages.length - 1);
        return;
      }
      that.moveSlider( that.currentIndex - 1 );
    }

  }, false)

  window.onresize = function() {
    makeAdjustments();
  }  

  function makeAdjustments(){
    projectTitle.style.fontSize = '80px';
    if ($(window).width() < 1180) {
      projectTitle.innerHTML = shortenedProjectTitles[that.currentIndex];

      if ($(window).width() < 500) {
        projectTitle.style.fontSize = '50px';
      }
    }
    else{
      projectTitle.innerHTML = projectTitles[that.currentIndex];
    }

    if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      projectTitle.style.fontSize = '43px'; //50px

      if ($(window).width() > $(window).height()) {
        projectView.style.top = '60%';
      }
      else if(($(window).width() < 360)){ //<=360
        projectTitle.style.fontSize = '34px'; //42px;
        projectView.style.top = '49%';
      }
      else{
        projectView.style.top = '49%';
      }

      projectView.style.fontSize = '20px';
    }
    else if(/iPad/i.test(navigator.userAgent)){
      projectView.style.fontSize = '24px';
      projectView.style.top = '49%';
      projectTitle.style.fontSize = '80px';

      if (($(window).width() == 1366 && $(window).height() == 1024)) {
        projectView.style.fontSize = '34px';
        projectView.style.top = '53%';
        projectTitle.style.fontSize = '100px';
      }
      else if($(window).width() == 1024 && $(window).height() == 1366) {
        projectTitle.style.fontSize = '100px';
        projectView.style.top = '48%';
        projectView.style.fontSize = '34px';
      }
      else if($(window).width() == 1024){
        projectView.style.top = '53%';
      }
    }
    else{
      projectView.style.top = defaultTopValue;
    }

  }

  function playAudio() {
    if(audioHasLoaded && progress == 100){
      document.getElementById('loader').style.width = '0%';
      document.getElementById('loader-progress').style.display = 'none';
      
      if(!bgMusic.isPlaying){
        bgMusic.play();
      }
      progress = 0;
    }
  }

  //Touch start
  var ts;

  $(document.body).on("touchstart", function(event) {
    playAudio();
    ts = event.originalEvent.touches[0].clientY;
  });

  $(document.body).mouseup(function() {
    playAudio();
  });

  $(document.body).on("touchmove", function(event) {
    if(dontScroll){
      return;
    }
  
    if(isPlaying){
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    
    var te = event.originalEvent.touches[0].clientY;
    if ( (ts - te) > 40) {
      if(that.currentIndex == slideImages.length - 1){
        that.moveSlider(0);
        return;
      }
      that.moveSlider( that.currentIndex + 1 );
    }
    else if( (ts-te) < -40){
      if(that.currentIndex == 0){
        that.moveSlider(slideImages.length - 1);
        return;
      }
      that.moveSlider( that.currentIndex - 1 );
    }
  
    event.preventDefault();
    event.stopPropagation();
  });

  
  document.onkeydown = function detectKey(e){
    if(dontScroll || isPlaying){
      return;
    }
    
    e = window.event ? window.event : e;
  
    if (e.keyCode == '38') {
      // up arrow
      if(that.currentIndex == 0){
        that.moveSlider(slideImages.length - 1);
        return;
      }
      that.moveSlider( that.currentIndex - 1);
    }
    else if(e.keyCode == '40'){
      //down arrow
      if(that.currentIndex == slideImages.length - 1){
        that.moveSlider(0);
        return;
      }
      that.moveSlider( that.currentIndex + 1 );
    }
  
  };

};


function goToSection(section) {
  document.getElementById("about").style.height = (section == 'about')? "100%" : "0%";

  if(section == 'about'){
    dontScroll = true;
    $('#about-section-content').fadeTo(500, 1);
  }
  else{
    dontScroll = false;
    $('#about-section-content').fadeOut(300, 0);
  }

}

var bgMusic;
var progress = 0;
var loader = document.getElementById('loader');
var loaderProgress = document.getElementById('loader-progress');

var musicIsPlaying = false;
var audioHasLoaded = false;
setTimeout(() => document.body.classList.add('render'), 60);

sounds.load(["audio/bg.mp3"]);

sounds.whenLoaded = function setup (){
  bgMusic = sounds["audio/bg.mp3"];
  bgMusic.loop = true;
  bgMusic.volume = 0.7;

  // if(!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
  //   bgMusic.play();
  // }
  
  musicIsPlaying = true;
  audioHasLoaded = true;

}

$('body').imagesLoaded()
	.done ( function(instance) {
		document.body.classList.remove('loading');
	})
	.progress( function( instance, image ) {
		progress += 10;
    loaderProgress.innerHTML = progress + '%';
    if(progress == 100){
      // if( /Android|webOS|iPhone|iPod|iPad|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        // setTimeout(() => loaderProgress.innerHTML = 'Tap the screen', 1000);
        setTimeout(() =>  TweenMax.to( loaderProgress, 0.8, {alpha:0, onComplete: function() {
          loaderProgress.style.fontSize = '40px';

          if( /Android|webOS|iPhone|iPod|iPad|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            loaderProgress.style.fontSize = '30px';
          }
          
          loaderProgress.innerHTML = 'Tap the screen';
          TweenMax.to( loaderProgress, 4, {alpha:1});
        } }), 1000);
        
      // }
      // else{
      //   setTimeout(() => loader.style.width = '0%', 1000);
      //   setTimeout(() => loaderProgress.style.display = 'none', 1000);
      // }
    }
  });
      
var spriteImages 	= document.querySelectorAll( '.slide-item__image' );
var spriteImagesSrc = [];

for ( var i = 0; i < spriteImages.length; i++ ) {
  var img = spriteImages[i];
  spriteImagesSrc.push( img.getAttribute('src' ) );
}

var initCanvasSlideshow = new CanvasSlideshow({
  sprites: spriteImagesSrc,
  displacementImage: 'img/dmaps/2048x2048/clouds.jpg',
  autoPlay: true,
  autoPlaySpeed: [10, 3],
  displaceScale: [200, 70]
});

function toggleAudio(turnOff){
  if(turnOff && !musicIsPlaying){
    return;
  }

  if(musicIsPlaying){
    bgMusic.fadeOut(1.4);
  }
  else{
    bgMusic.fade(0.7, 1.4);
  }

  for ( var i = 1; i < 6; i++ ) {
    if(musicIsPlaying){
      $('#audio-bars li:nth-child('+i+')').css('animation', 'none');
    }
    else{
      $('#audio-bars li:nth-child('+i+')').css('animation', '');
    }
    
  }
  musicIsPlaying = !musicIsPlaying;
  
}
