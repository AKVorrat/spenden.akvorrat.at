// PDF constants
var mrgnLeft = 45;
var mrgnRight = 85;
var offset = 15;
var width = 595.28;
var height = 841.89;
var innerWidth = width - mrgnLeft - mrgnRight;
var columnSpace = 20;
var columnWidth = innerWidth / 2 - columnSpace / 2;
var fieldOffset = 4;
var fontSize;
var intervals = {0:"einmalig", 1:"pro Monat", 3:"pro Quartal", 6:"pro Halbjahr", 12:"pro Jahr"}
var logo = new Image();
logo.src = "./img/epicenter-logo.jpg";


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
	$("#debit-amount").attr("value", amount);
	$("#paypal-1-amount").attr("value", amount);
	$("#paypal-2-amount").attr("value", amount);
	$("#credit-amount").attr("value", amount);
	$("#eps-amount").attr("value", amount);

	if(amount < 75)
		$("#button-debit").addClass("disabled");
	else if($("#methods input[name='interval']:checked").val() == 0)
		$("#button-debit").removeClass("disabled");

	if($("#methods input[name='interval']:checked").val() != 0 || amount >= 75) {
		$(".abovelimit").removeClass("hidden");
		$(".belowlimit").addClass("hidden");
	} else {
		$(".abovelimit").addClass("hidden");
		$(".belowlimit").removeClass("hidden");
	}

	// Update height.
	$("#payment").slick('setPosition');
}

// user selects different interval

function setPaymentInterval(interval) {
	$("#debit-interval").attr("value", interval);
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

	// disable debit
	$("#button-debit").addClass("disabled");

	// disable credit
	$("#button-credit").addClass("disabled");

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

	// enable debit
	if($("#methods input[name='amount']:checked").val() >= 75)
		$("#button-debit").removeClass("disabled");

	// enable credit
	$("#button-credit").removeClass("disabled");

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

// Generate SEPA PDF

function genpdf() {
	var user = {
		lastname: getInput("#debit-lastname"),
		firstname: getInput("#debit-firstname"),
		street: getInput("#debit-street"),
		number: getInput("#debit-number"),
		postcode: getInput("#debit-zip"),
		residence: getInput("#debit-residence"),
		email: getInput("#debit-email"),
		newsletter: $("#debit-newsletter").prop("checked"),
		phone: getInput("#debit-phone"),
		bank: getInput("#debit-bank"),
		iban: getInput("#debit-iban"),
		bic: getInput("#debit-bic"),
		interval: $("#methods input[name='interval']:checked").val(),
		amount: $("#methods input[name='amount']:checked").val()
	}

	var dateObj = new Date();
	date = dateObj.getDate() + "." + (dateObj.getMonth() + 1) + "." + dateObj.getFullYear();

	var doc = new jsPDF("portrait", "pt", "a4");
	doc.setTextColor(0, 0, 0);
	doc.setDrawColor(0, 0, 0);
	doc.setLineWidth(0.4);

	offset += 20;
	doc.addImage(logo, "JPEG", width - 240 - mrgnRight/2, offset, 240, 120);
	offset += 160;

	setFontSize(doc, 12);
	doc.setFontType("normal");
	text(doc, "epicenter.works - Plattform Grundrechtspolitik", 2);
	text(doc, "Annagasse 8/1/8", 2);
	text(doc, "1010 Wien", 2);
	text(doc, "office@epicenter.works", 16);

	setFontSize(doc, 14);
	doc.setFontType("bold");
	var title = user.interval > 0 ? "Antrag auf Fördermitgliedschaft" : "Spenden per Bankeinzug";
	text(doc, title, 12);

	if (user.interval > 0) {
		setFontSize(doc, 10);
		doc.setFontType("bold");
		block(doc, "Hiermit beantrage ich die Fördermitgliedschaft beim Verein epicenter.works - Plattform Grundrechtspolitik (hiernach: epicenter.works). Als außerordentliches Mitglied bin ich dazu eingeladen, mich aktiv in die Vereinsarbeit einzubringen und dadurch eine etwaige oder ordentliche Mitgliedschaft beim Verein zu erlangen.", 16);
	}

	setFontSize(doc, 12);
	doc.setFontType("normal");
	fieldColumn(doc, user.lastname, "Nachname", user.firstname, "Vorname", 10);
	field(doc, user.street + " " + user.number, "Straße / Hausnr.", 10);
	fieldColumn(doc, user.postcode, "PLZ", user.residence, "Ort", 10);
	fieldColumn(doc, user.email, "E-Mail", user.phone, "Telefonnummer", 14);

	setFontSize(doc, 10);
	doc.setFontType("bold");
	var addText = user.newsletter ? " Zusätzlich möchte ich den Newsletter abonnieren, um regelmäßig über die Tätigkeiten des Vereins informiert zu werden." : "";
	block(doc, "Ich unterstütze epicenter.works " + intervals[user.interval] + " mit " + user.amount + " Euro." + addText, 18);

	setFontSize(doc, 12);
	doc.setFontType("normal");
	fieldColumn(doc, date + ", ", "Datum, Ort", "", "Unterschrift", 16, true);

	setFontSize(doc, 12);
	doc.setFontType("bold");
	text(doc, "SEPA Lastschriftmandat", 6);

	setFontSize(doc, 10);
	doc.setFontType("normal");
	block(doc, "Ich ermächtige den Verein epicenter.works - Plattform Grundrechtspolitik (ZVR 140062668, Creditor ID: AT58ZZZ00000049332, hiernach: epicenter.works), Zahlungen von meinem Konto mittels SEPA-Lastschrift einzuziehen. Zugleich weise ich mein Kreditinstitut an, die von epicenter.works auf mein Konto gezogenen SEPA-Lastschriften einzulösen. Ich kann innerhalb von acht Wochen, beginnend mit dem Belastungsdatum, die Erstattung des belasteten Betrages verlangen. Es gelten dabei die mit meinem Kreditinstitut vereinbarten Bedingungen. Vor dem ersten Einzug einer SEPA-Basis-Lastschrift wird mich epicenter.works über den Einzug in dieser Verfahrensart unterrichten.", 16);

	setFontSize(doc, 12);
	doc.setFontType("normal");
	fieldColumn(doc, user.bank, "Kreditinstitut", user.bic, "BIC", 10);
	field(doc, user.iban, "IBAN", 10);
	fieldColumn(doc, date + ", ", "Datum, Ort", "", "Unterschrift", 16, true);

	if (user.interval > 0)
		doc.save("epicenter-antrag-auf-foerdermitgliedschaft.pdf");
	else
		doc.save("epicenter-spenden-per-bankeinzug.pdf");

	offset = 15;
}

function getInput(id) {
	var value = $(id).val();
	if(!value || value.trim().length === 0) return "-";
	else return value;
}

function setFontSize(document, size) {
	fontSize = size;
	document.setFontSize(size);
}

function text(document, text, addOffset) {
	offset += fontSize;
	document.text(mrgnLeft, offset, text);
	offset += addOffset;
}

function block(document, line, addOffset) {
	paragraph = document.splitTextToSize(line, innerWidth);
	text(document, paragraph, paragraph.length * fontSize + addOffset);
}

function field(document, text, description, addOffset) {
	cachedFontSize = fontSize;
	offset += fontSize;
	document.text(mrgnLeft + fieldOffset, offset, text);
	offset += 3;
	document.line(mrgnLeft, offset, width - mrgnRight, offset);
	setFontSize(document, 8);
	offset += fontSize;
	document.text(mrgnLeft, offset, description);
	offset += addOffset;
	setFontSize(document, cachedFontSize);
}

function fieldColumn(document, text1, description1, text2, description2, addOffset, highlight) {
	cachedFontSize = fontSize;
	offset += fontSize;
	document.text(mrgnLeft + fieldOffset, offset, text1);
	document.text(mrgnLeft + columnWidth + columnSpace + fieldOffset, offset, text2);
	offset += 3;
	document.line(mrgnLeft, offset, mrgnLeft + columnWidth, offset);
	document.line(mrgnLeft + columnWidth + columnSpace, offset, mrgnLeft + columnWidth + columnSpace + columnWidth, offset);
	if(typeof highlight !== "undefined") {
		drawArrow(document, mrgnLeft + columnWidth + columnSpace + columnWidth, offset - fontSize / 2);
	}
	setFontSize(document, 8);
	offset += fontSize;
	document.text(mrgnLeft, offset, description1);
	document.text(mrgnLeft + columnWidth + columnSpace, offset, description2);
	offset += addOffset;
	setFontSize(document, cachedFontSize);
}

function drawArrow(document, x, y) {
	document.setDrawColor(255, 0, 0);
	document.setFillColor(255, 0, 0);
	document.triangle(x, y, x+30, y+15, x+30, y-15, "FD");
	document.rect(x+30, y-5, 20, 10, "FD");
	document.setDrawColor(0, 0, 0);
	document.setFillColor(0, 0, 0);
}
