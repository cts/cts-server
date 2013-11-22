// ************************************************************** //  


// scroll to comments section when viewing blog post //
$('.comments-toggle').on('click',function(){
     $('html, body').animate({
         scrollTop: $('#comments').offset().top - 110 }, 1000);    
     return false;
 });


// ************************************************************** //  


// featured work slider //
//$('.work--featured-slider .slider').bxSlider({
//  mode: 'fade',
//  speed: 1000      
//});   

// feedback slider //
//$('.feedback--slider .slider').bxSlider({
//  mode: 'horizontal',
//  useCSS: false,
//  easing: 'easeOutQuart',
//  speed: 1000      
//}); 

// feedback slider //
//$('.jumbotron--slider .slider').bxSlider({
//  mode: 'horizontal',
//  useCSS: false,
//  easing: 'easeOutQuart',
//  speed: 1000      
//}); 

// ************************************************************** //


// menu functionality //

// get width of window //
var _getInnerWidth = function () {
    return typeof window.innerWidth !== 'undefined' ? window.innerWidth : document.documentElement.clientWidth;
};

// max width 767px //
// close mobile nav when links are clicked on mobile sizzes //    
if (_getInnerWidth() < 768) {
    // close collapsed/mobile menu on click of an item in the menu //
    $('.nav li a').on('click',function(){
        $('.navbar-ex1-collapse').collapse('toggle');
    });
}

// min width 768px //
if (_getInnerWidth() >= 768) {
    // animate to relevant area within the page //
    $('a[href*=#]:not([href=#])').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') 
            || location.hostname == this.hostname) {

            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
               if (target.length) {
                 $('html,body').animate({
                     scrollTop: target.offset().top
                }, 1000);
                return false;
            }
        }
    });
}


// ************************************************************** //


// show hidden portfolio content //
$(".work").hide();

$("a.portfolio-toggle").on("click", function(event) {

    // Getting the id here ("#" + id) to allow us to use this var inside selectors
    // .attr give us the value of the attribute that we've passed as param
    // I`ve added some unnecesary variables and steps while splitting text just to bring the max clarity

    var thisID = $(this).attr("id").split("-"),
        idPart1 = thisID[0].replace("link","work"),
        idPart2 = thisID[1],
        elementID = "#" + idPart1 + "-" + idPart2; //this will result in something like #work-1
        
    $('.work--detail').addClass('work--show'); 

  // Hide again the .work elements if they were previously showed
  $(".work").hide();
     
    // Now, I will show just our element
    $(elementID).show();
    
    $(elementID).slideDown;

    $('html, body').animate({scrollTop: $('.hidden-content-top').offset().top - 110 }, 1000); 

    event.preventDefault(); // this instruction prevents the link of the default behavior, note that I'm passing event as param at the very top.

});

// close hidden content //
// You should add a class to all the a tags like "close-link" id to each a dynamically like..... <a id="close-link-1" href="#" class="close-link">
$(".close-link").on("click", function () {
  
  var thisID = $(this).attr("id").split("-"),
        idPart1 = thisID[1].replace("link","work"),
        idPart2 = thisID[2],
        workID = "#" + idPart1 + "-" + idPart2, // this will result in something like #work-1
        portfolioID = workID.replace("work-","portfolio-"); // this will result in something like #portfolio-1
  
  $(workID).slideUp();
  $('html, body').animate({scrollTop: $(portfolioID).offset().top - 140 }, 1000); 
  $('.work--detail').removeClass('work--show');
  return false;
});


// ************************************************************** //

