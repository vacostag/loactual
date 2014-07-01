$(function(){
	la = new loActual();
	la.init();
});

function loActual(){}

loActual.prototype.images 			= new Array();
loActual.prototype.imagesL 			= new Array();
loActual.prototype.interfaceI 		= new Array();
loActual.prototype.interfaceL 		= new Array();
loActual.prototype.errorLoaded 		= new Array();
loActual.prototype.options	 		= new Array();
loActual.prototype.interfaceClass 	= "interface-images";
loActual.prototype.timmingError		= 10000;
loActual.prototype.textHelper		= "";
loActual.prototype.textInterval		= "";

loActual.prototype.init = function(){
	var self = this;
	$.each($("." + self.interfaceClass), function(i, item){
		self.interfaceI[i] = item;
	});
	this.loadInterface();
	if($(".wrapper-10_0").data("type") == "photo"){
		$.each($("img:not(." + self.interfaceClass + ")"), function(i, item){
			self.images[i] = item;
		});
		this.loadOptions();
	}
	this.initOptions();
}

loActual.prototype.initOptions = function(){
	var width = 0;
	var self = this;
	var $scroll = $(".navigation-bar");
	$.each($(".navigation-bar ul li"), function(i, item){
		width += $(this).width();
		self.options.push(item);
		
	});
	$(".overflowed-navigation").width(width);
	$scroll.tinyscrollbar({
		axis: "x",
		wheelSpeed: 128,
		thumbSize: 128,
		
	});
	setInterval(function(){
		self.showOptions()
	}, 500);
}

loActual.prototype.showOptions = function(){
	$(this.options[0]).css("left", 0);
	this.options.shift();
}

loActual.prototype.loadInterface = function(){
	var self = this;
	$.each(this.interfaceI, function(i,item){
		$(item)
			.load(function(){
				self.interfaceL.push(item);
				self.progress(true);
			})
			.error(function(){
				self.errorLoaded.push(item);
			})
			.attr("src", $(item).data("original"))
			.css("opacity", 1);
	});
	if(this.errorLoaded.length > 0){
		setInterval(function(){
			self.loadErrors();
		}, this.timmingError);
	}
	this.wrapText(".title-wrapper");
	setTimeout(function(){
		self.hideInteractions();
	}, 10000);
}

loActual.prototype.loadOptions = function(){
	var self = this;
	$.each(this.images, function(i,item){
		$(item)
			.load(function(){
				self.imagesL.push(item);
				self.progress(false);
			})
			.error(function(){
				self.errorLoaded.push(item);
			})
			.attr("src", $(item).data("original"))
			.css("opacity", 1);
	});
	if(this.errorLoaded.lenght > 0){
		setInterval(function(){
			this.loadErrors();
		}, this.timmingError);
	}
}

loActual.prototype.loadErrors = function(){
	this.imagesI = this.errorLoaded;
	this.imagesL.length = 0;
	var self = this;
	$.each(this.errorLoaded, function(i,item){
		$(item)
			.load(function(){
				self.imagesL.push(item);
				self.progress(false);
			})
			.error(function(){
				self.errorLoaded.push(item);
			})
			.attr("src", $(item).data("original"))
			.css("opacity", 1);
	});
}

loActual.prototype.progress = function(interfaces){
	$(".loader .bar").width("0%");
	if(interfaces){
		$(".loader .bar").width((this.interfaceL.length/this.interfaceI.length)*640);
	}else{
		$(".loader .bar").width(((this.imagesL.length/this.images.length)*100) + "%");
	}
	if($(".loader .bar").width() == "640"){
		$(".loader .bar").css("opacity", 0);
	}
}

loActual.prototype.wrapText = function(object){
	var width = Math.floor((640 / $(object + " div:first-child").width())*100);
	$(object + " div:first-child p").css("font-size",  width + "%");
	var height = $(object + " div:first-child").height();
	if(height > 55){
		height = (55 / height);
		$(object + " div:first-child p").css("font-size", height * width + "%");
	}
	$(object + " div:first-child").css("position", "relative");
	this.writeText(object);
}

loActual.prototype.writeText = function(object){
	var text = $(object + " p").html();
	$(object + " p").html("");
	this.textHelper = text.split('');
	var self = this;
	this.textInterval = setInterval(function(){
		self.animateWritting(object);
	}, 100);
}

loActual.prototype.animateWritting = function(object){
	if(this.textHelper.length > 0){
		$(object + " p").html($(object + " p").html() + this.textHelper.shift());
	}else{
		clearInterval(this.textInterval);
	}
}

loActual.prototype.hideInteractions = function(){
	$(".interaction-helper").css("opacity", 0);
}