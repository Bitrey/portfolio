const section1=$("#section1"),navbar=$(".navbar");function isInViewport(t){var e=t.offset().top,o=e+t.outerHeight()/2,n=$(window).scrollTop(),i=n+$(window).height();return o>n&&e<i}$(document).on("click",'a[href^="#"]',function(t){t.preventDefault(),$("html, body").stop().animate({scrollTop:$($(this).attr("href")).offset().top},800,"swing")}),$(document).on("resize scroll",function(t){isInViewport(section1)&&navbar.is(":visible")?navbar.slideUp():!isInViewport(section1)&&navbar.is(":hidden")&&navbar.slideDown(),$(".section").each(function(){if(isInViewport($(this)))return $(".nav-link").removeClass("active"),$(`a[href='#${$(this).attr("id")}']`).addClass("active"),!1})}),$(document).on("scroll",function(){clearTimeout(topScroller),$("#topScroller").fadeOut()});let topScroller=setTimeout(function(){$("#topScroller").fadeIn()},5e3);

const contactText = JSON.parse($("#contactText").text());
$("#contactText").remove();

particlesJS('particles-js',
  
  {
    "particles": {
      "number": {
        "value": 80,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#8c0783"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        },
        "polygon": {
          "nb_sides": 5
        },
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 0.5,
        "random": false,
        "anim": {
          "enable": false,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 5,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 20,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#8c0783",
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 3,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "repulse"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 200,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 200,
          "size": 40,
          "duration": 2,
          "opacity": 8,
          "speed": 2
        },
        "repulse": {
          "distance": 100
        },
        "push": {
          "particles_nb": 2
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true,
    "config_demo": {
      "hide_card": false,
      "background_color": "#fff",
      "background_image": "",
      "background_position": "50% 50%",
      "background_repeat": "no-repeat",
      "background_size": "cover"
    }
  }

);

let splashImg = document.getElementById("section1-background-img");
let textureImg = document.getElementById("section4-background-img");

// Parallax img
new simpleParallax(splashImg);
new simpleParallax(textureImg);

// Timer for reminder
setTimeout(function(){
    $("#header-reminder").fadeIn("slow");
}, 5500);

$(document).ready(function(){
    $(".animsition").animsition({
      inClass: 'fade-in-down-lg',
      outClass: 'zoom-out-sm',
      inDuration: 1500,
      outDuration: 800,
      linkElement: '.animsition-link',
      // e.g. linkElement: 'a:not([target="_blank"]):not([href^="#"])'
      loading: true,
      loadingParentElement: 'body', //animsition wrapper element
      loadingClass: 'animsition-loading',
      loadingInner: '', // e.g '<img src="loading.svg" />'
      timeout: false,
      timeoutCountdown: 5000,
      onLoadEvent: true,
      browser: [ 'animation-duration', '-webkit-animation-duration'],
      // "browser" option allows you to disable the "animsition" in case the css property in the array is not supported by your browser.
      // The default setting is to disable the "animsition" in a browser that does not support "animation-duration".
      overlay : false,
      overlayClass : 'animsition-overlay-slide',
      overlayParentElement : 'body',
      transition: function(url){ window.location.href = url; }
    });
});

let quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
      toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          ['link'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{ 'font': [] }]
        ]
    }
});

let formBtn = $("#sendForm");
let oldHTML;

$("#emailForm").submit(function(e){
    e.preventDefault();
    $("#bodyText").val($(".ql-editor").html());
    quill.enable(false);
    $("#error").hide();
    if(!oldHTML){
        oldHTML = formBtn.html();
    }
    formBtn.html(`<img src="/img/spinner.svg" alt="Caricamento">`);
    formBtn.prop("disabled", true);
    
    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const email = document.getElementById('email').value;
    const text = document.getElementsByClassName('ql-editor')[0].innerHTML;
    const captcha = document.getElementById('g-recaptcha-response').value;

    $.ajax({
        data: JSON.stringify({ name, surname, email, text, captcha }),
        method: "POST",
        url: "/contact",
        headers: {
            'Content-type': 'application/json'
        },
        error: function(r){
            formBtn.html(oldHTML);
            quill.enable(false);
            formBtn.prop("disabled", false);
            $("#error").show().text(r.responseJSON.msg);
        },
        success: function(){
            formBtn.remove();
            let height = $("#section7-subdiv").height();
            $("#section7-subdiv").html(`<h1>${contactText.THANK_YOU}</h1><p style="margin-bottom: ${height / 2}px;">${contactText.REPLY_SOON}</p>`);
        }
    }); 
    return false; 
})

// <img src="/img/spinner.svg" alt="Caricamento">