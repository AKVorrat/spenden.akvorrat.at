// Scroll smoothly
jQuery(document).ready(function () {
	$("a[href*='#']:not([href='#'])").click(function() {
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') || location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			if (target.length) {
				$('html,body').animate({
					scrollTop: target.offset().top
				}, 800);
				return false;
			}
		}
	});
});

// Load donation value

jQuery(document).ready(function () {
	$.getJSON("data/donations.json", function(data) {
		$("#donationbar span").html(data.current.toLocaleString() + "€ von " + data.limit.toLocaleString() + "€ erreicht");
		$("#donationbar div").css("width", (data.current / data.limit * 100) + "%");
	});
});

// Enable carousels

jQuery(document).ready(function () {
	$("#payment").slick({
		arrows: false,
		adaptiveHeight: true,
		accessibility: false,
		draggable: false,
		swipe: false,
		touchMove: false,
		infinite: false
	});
});

// payment carousel triggers

function swipe(target) {
  if (target === 'CC' || target === 'EPS') {
    let amount = $("#paypal-1-amount").attr("value");
    
    $.getJSON('/checkout.php?paymentProvider=' + target +'&amount=' + amount, function(data) {
      // console.log(data);
      window.top.location.href = data.redirectUrl;
    });

    return;
  }

	$("#payment-methods > *").addClass("hidden");
	$("#" + target).removeClass("hidden");
	$("#payment").slick("slickGoTo", 1);
	$("html,body").animate({
		scrollTop: $("#payment").offset().top
	}, 800);
}

function showMenu() {
	$("#payment").slick("slickGoTo", 0);
}

// redirect to new page

function redirect_supporter() {
    amount = $("#paypal-1-amount").attr('value');
    switch ($("#paypal-1-interval").attr('value')) {
        case '1': interval = 'monthly'; break;
        case '3': interval = 'quarterly'; break;
        case '6': interval = 'biannually'; break;
        case '12': interval = 'annually'; break;
    }
    window.location = 'https://support.epicenter.works/join?amount=' + amount + '&interval=' + interval;
}

// variable input field

jQuery(document).ready(function () {
	$("*[id*='amount-input']").change(function () {
		getMethodElement(this, "-amount-x").attr("value", this.value);
	});
	$("*[id*='amount-input']").click(function () {
		getMethodElement(this, "-amount-x").click();
	});
	$("input[name*='-amount']").change(function () {
		if($(this).prop("id").indexOf("-amount-x") > -1 && $(this).prop("checked"))
			getMethodElement(this, "-amount-input").attr("required", "required");
		else
			getMethodElement(this, "-amount-input").removeAttr("required");
	});
});

function getMethodElement(object, string) {
	var id = $(object).attr('id');
	method = id.slice(0, id.indexOf("-"));
	return $("#" + method + string);
}

function becomeSupporter() {
	$("#methods-amount-25").click();
	$("#methods-interval-month").click();
	$("#payment").slick("slickGoTo", 0);
	$("html,body").animate({
		scrollTop: $("#payment").offset().top
	}, 800);
}

jQuery(document).ready(function () {
	$("#methods input[name='interval']").change(function () {
		setPaymentInterval(this.value);
	});
	$("#methods input[name='amount']").change(function () {
		setPaymentAmount(this.value);
	});
	$("#methods input[name='amount'] + label > .amount-input").on("keyup mouseup input", function () {
		setPaymentAmount(this.value);
	});
});

// user selects different amount

function setPaymentAmount(amount) {
	$("#paypal-1-amount").attr("value", amount);
	$("#paypal-2-amount").attr("value", amount);
	$("#stripe-amount").attr("value", amount * 100);

	// Update height.
	$("#payment").slick('setPosition');
}

// user selects different interval

function setPaymentInterval(interval) {
	$("#paypal-1-interval").attr("value", interval);

	if(interval > 0)
		selectedRepeat();
	else
		selectedOnce();

	// Update height.
	$("#payment").slick('setPosition');
}

// user selects interval

function selectedRepeat() {
	// toggle Fördermitglied / Lastschrift
	$(".lastschrift").addClass("hidden");
	$(".foemi").removeClass("hidden");

	$(".abovelimit").removeClass("hidden");
	$(".belowlimit").addClass("hidden");

	// toggle paypal form
	$("#form-paypal-2").addClass("hidden");
	$("#form-paypal-1").removeClass("hidden");

	// enable supporter
	$("#button-supporter").removeClass("disabled");

	// disable stripe
	$("#form-stripe").addClass("hidden");

	// disable eps
	$("#button-eps").addClass("disabled");
}

// user selects single payment

function selectedOnce() {
	// toggle Fördermitglied / Lastschrift
	$(".foemi").addClass("hidden");
	$(".lastschrift").removeClass("hidden");

	if($("#methods input[name='amount']:checked").val() >= 75) {
		$(".abovelimit").removeClass("hidden");
		$(".belowlimit").addClass("hidden");
	} else {
		$(".abovelimit").addClass("hidden");
		$(".belowlimit").removeClass("hidden");
	}

	// toggle paypal form
	$("#form-paypal-1").addClass("hidden");
	$("#form-paypal-2").removeClass("hidden");

	// disable supporter
	$("#button-supporter").addClass("disabled");

	// enable stripe
	$("#form-stripe").removeClass("hidden");

	// enable eps
	$("#button-eps").removeClass("disabled");
}

// Format IBAN input field
jQuery(document).ready(function () {
	$("input[name='iban']").on("input propertychange", function (event) {
		var formatArray = this.value.replace(/[^\w\d]/g, "").match(/([\w\d]{1,4})/g);
		if (formatArray !== null && formatArray.length > 0) {
			this.value = formatArray.join(" ");
		}
	});
});
