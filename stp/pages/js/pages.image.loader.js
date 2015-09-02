'use strict';
var imgElement = document.querySelectorAll('.lazy');
for (var i = 0; i < imgElement.length; ++i) {
	imgElement[i].onload = function () {
		this.className += " loaded";
	}
    if(imgElement[i].complete) {
      imgElement[i].className += " loaded";
    }
}