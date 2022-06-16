window.onload = onloadFunc;
function onloadFunc() {
	hideLoader();
}
function hideLoader(){
	$('#loading').hide();
	$('cursor').css({'overflow-y':'scroll'});
}
function getInfo(){
	enterName = document.getElementById("name").value;
	idk = document.getElementById("color");
	colorValue = idk.value;
	localStorage.setItem('enterName', enterName);
	localStorage.setItem('colorValue', colorValue);
	if(enterName == "" || enterName == null){
		alert("Enter a name!");
	}
	if(enterName == "Admin"){
		window.location.replace("adminChat.html");
	}
	else{
		//alert(enterName);
		//alert(colorValue);
		window.location.replace("textChat.html");
	}
}