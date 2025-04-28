jQuery(function ($) {$(document).ready(function (){

	function addTagPill(name) {
		$("#tag-pills").append('<li value="'+name+'"><span>'+name+'</span><a value="'+name+'"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2c-5.53 0-10 4.47-10 10s4.47 10 10 10 10-4.47 10-10-4.47-10-10-10zm5 13.59l-1.41 1.41-3.59-3.59-3.59 3.59-1.41-1.41 3.59-3.59-3.59-3.59 1.41-1.41 3.59 3.59 3.59-3.59 1.41 1.41-3.59 3.59 3.59 3.59z" ></path></svg></a></li>');
		$("#tagList option[value='"+name+"']").attr('disabled', '');
	}

	function removeTagPill(name) {
		$("#tagList option[value='"+name+"']").removeAttr('disabled');
		$("#tag-pills li[value='"+name+"']").remove();
	}

	$("#tags").keypress(function(event) {
		if (event.keyCode==13) {
			$(this).val($.trim($(this).val()));
			if ($(this).val() && !$("li[value='"+$(this).val()+"']")[0]){
				if ($(this).val().indexOf(',')) {
					var tagSplit = $(this).val().split(',');
					for (var i = 0; i < tagSplit.length; i++) {
						console.log(i+" = "+tagSplit[i]);
						addTagPill($.trim(tagSplit[i]));
					}
					$(this).val('');

				}else{
					addTagPill($(this).val());
					$(this).val('');

				}
			}
		}
	});

	$('#tag-pills').on('click', 'li a', function(){
		removeTagPill( $(this).attr('value'));
	});

	$('.optionMenu').on('click', '.button', function(){

		console.log($(this).next('ul').css('display'));
		if ($(this).next('ul').css('display') == 'none') {
			$(this).next('ul').removeAttr('style');
		}else{
			$(this).next('ul').css('display','none');
		}
	});



})})