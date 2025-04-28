jQuery(function ($) {$(document).ready(function (){
	$(".navbar-toggler, .overlay").on("click", function(){
		$(".mobileMenu, .overlay ").toggleClass("open");
	})

	$(".switch input[type=checkbox]").change(function(event) {
		if($(".switch input[type=checkbox]")[0].checked){
			$("body").addClass('dark');
		}else{
			$("body").removeClass('dark');
		}
	});
})})