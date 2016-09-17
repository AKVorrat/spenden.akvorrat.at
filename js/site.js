// PDF constants
var mrgn = 85;
var offset = 15;
var width = 595.28;
var height = 841.89;
var innerWidth = width - 2 * mrgn;
var columnSpace = 20;
var columnWidth = innerWidth / 2 - columnSpace / 2;
var fieldOffset = 4;
var fontSize;
var intervals = {0:"einmalig", 1:"pro Monat", 3:"pro Quartal", 6:"pro Halbjahr", 12:"pro Jahr"}
var logo = new Image();
logo.src = "./img/akv-logo.jpg";


// Scroll smoothly

jQuery(document).ready(function () {
	$("a[href*='#']:not([href='#'])").click(function() {
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')  || location.hostname == this.hostname) {
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

// Enable owlCarousel

jQuery(document).ready(function () {
	$(".owl-carousel").owlCarousel({
		loop: true,
		center: true,
		nav: false,
		autoWidth: true,
		dots: false,
		margin: 32,
		autoplay: true,
		autoplayTimeout: 3000,
		autoplayHoverPause: true,
		responsive: false
	});
});

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
	
	if(amount < 75)
		$("#button-debit").addClass("disabled");
	else if($("#methods input[name='interval']:checked").val() == 0)
		$("#button-debit").removeClass("disabled");
}

// user selects different interval

function setPaymentInterval(interval) {
	$("#debit-interval").attr("value", interval);
	$("#paypal-1-interval").attr("value", interval);
	
	if(interval > 0)
		selectedRepeat();
	else
		selectedOnce();
}

// user selects interval

function selectedRepeat() {
	// toggle Fördermitglied / Lastschrift
	$(".lastschrift").addClass("hidden");
	$(".foemi").removeClass("hidden");
	
	// toggle paypal form
	$("#button-paypal").attr("form", "form-paypal-1");
	
	// enable supporter
	$("#button-supporter").removeClass("disabled");
	
	// disable debit
	$("#button-debit").addClass("disabled");
	
	// disable credit
	$("#button-credit").addClass("disabled");
}

// user selects single payment

function selectedOnce() {
	// toggle Fördermitglied / Lastschrift
	$(".foemi").addClass("hidden");
	$(".lastschrift").removeClass("hidden");
	
	// toggle paypal form
	$("#button-paypal").attr("form", "form-paypal-2");
	
	// disable supporter
	$("#button-supporter").addClass("disabled");
	
	// enable debit
	if($("#methods input[name='amount']:checked").val() >= 75)
		$("#button-debit").removeClass("disabled");
	
	// enable credit
	$("#button-credit").removeClass("disabled");
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
	
	doc.addImage(logo, "JPEG", (width - 160) / 2, offset, 160, 160);
	offset += 160;
	
	setFontSize(doc, 12);
	doc.setFontType("normal");
	text(doc, "Arbeitskreis Vorratsdaten Österreich", 2);
	text(doc, "Kirchberggasse 7/5", 2);
	text(doc, "1070 Wien", 2);
	text(doc, "office@akvorrat.at", 16);
	
	setFontSize(doc, 14);
	doc.setFontType("bold");
	var title = user.interval > 0 ? "Antrag auf Fördermitgliedschaft" : "Spenden per Bankeinzug";
	text(doc, title, 12);
	
	if (user.interval > 0) {
		setFontSize(doc, 10);
		doc.setFontType("bold");
		block(doc, "Hiermit beantrage ich die Fördermitgliedschaft beim Arbeitskreis Vorratsdaten Österreich. Als außerordentliches Mitglied bin ich dazu eingeladen, mich aktiv in die Vereinsarbeit einzubringen und dadurch eine etwaige oder ordentliche Mitgliedschaft beim Verein zu erlangen.", 16);
	}
	
	setFontSize(doc, 12);
	doc.setFontType("normal");
	fieldColumn(doc, user.lastname, "Nachname", user.firstname, "Vorname", 10);
	field(doc, user.street, "Straße", 10);
	fieldColumn(doc, user.postcode, "PLZ", user.residence, "Ort", 10);
	fieldColumn(doc, user.email, "E-Mail", user.phone, "Telefonnummer", 14);
	
	setFontSize(doc, 10);
	doc.setFontType("bold");
	var addText = user.newsletter ? " Zusätzlich möchte ich den Newsletter abonnieren, um regelmäßig über die Tätigkeiten des Vereins informiert zu werden." : "";
	block(doc, "Ich unterstütze den Arbeitskreis Vorratsdaten Österreich " + intervals[user.interval] + " mit " + user.amount + " Euro." + addText, 18);
	
	setFontSize(doc, 12);
	doc.setFontType("normal");
	fieldColumn(doc, date + ", ", "Datum, Ort", "", "Unterschrift", 16, true);
	
	setFontSize(doc, 12);
	doc.setFontType("bold");
	text(doc, "SEPA Lastschriftmandat", 6);
	
	setFontSize(doc, 10);
	doc.setFontType("normal");
	block(doc, "Ich ermächtige den Arbeitskreis Vorratsdaten Österreich (ZVR 140062668, Creditor ID: AT58ZZZ00000049332), Zahlungen von meinem Konto mittels SEPA-Lastschrift einzuziehen. Zugleich weise ich mein Kreditinstitut an, die vom Arbeitskreis Vorratsdaten Österreich auf mein Konto gezogenen SEPA-Lastschriften einzulösen. Ich kann innerhalb von acht Wochen, beginnend mit dem Belastungsdatum, die Erstattung des belasteten Betrages verlangen. Es gelten dabei die mit meinem Kreditinstitut vereinbarten Bedingungen. Vor dem ersten Einzug einer SEPA-Basis-Lastschrift wird mich der Arbeitskreis Vorratsdaten Österreich über den Einzug in dieser Verfahrensart unterrichten.", 16);
	
	setFontSize(doc, 12);
	doc.setFontType("normal");
	fieldColumn(doc, user.bank, "Kreditinstitut", user.bic, "BIC", 10);
	field(doc, user.iban, "IBAN", 10);
	fieldColumn(doc, date + ", ", "Datum, Ort", "", "Unterschrift", 16, true);
	
	if (user.interval > 0)
		doc.save("akvorrat-antrag-auf-foerdermitgliedschaft.pdf");
	else
		doc.save("akvorrat-spenden-per-bankeinzug.pdf");
	
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
	document.text(mrgn, offset, text);
	offset += addOffset;
}

function block(document, line, addOffset) {
	paragraph = document.splitTextToSize(line, innerWidth);
	text(document, paragraph, paragraph.length * fontSize + addOffset);
}

function field(document, text, description, addOffset) {
	cachedFontSize = fontSize;
	offset += fontSize;
	document.text(mrgn + fieldOffset, offset, text);
	offset += 3;
	document.line(mrgn, offset, width - mrgn, offset);
	setFontSize(document, 8);
	offset += fontSize;
	document.text(mrgn, offset, description);
	offset += addOffset;
	setFontSize(document, cachedFontSize);
}

function fieldColumn(document, text1, description1, text2, description2, addOffset, highlight) {
	cachedFontSize = fontSize;
	offset += fontSize;
	document.text(mrgn + fieldOffset, offset, text1);
	document.text(mrgn + columnWidth + columnSpace + fieldOffset, offset, text2);
	offset += 3;
	document.line(mrgn, offset, mrgn + columnWidth, offset);
	document.line(mrgn + columnWidth + columnSpace, offset, mrgn + columnWidth + columnSpace + columnWidth, offset);
	if(typeof highlight !== "undefined") {
		drawArrow(document, mrgn + columnWidth + columnSpace + columnWidth, offset - fontSize / 2);
	}
	setFontSize(document, 8);
	offset += fontSize;
	document.text(mrgn, offset, description1);
	document.text(mrgn + columnWidth + columnSpace, offset, description2);
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
