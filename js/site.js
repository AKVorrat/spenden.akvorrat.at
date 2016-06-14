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
var logo = new Image();
logo.src = "./img/akv-logo.jpg";

// Setup accordion

jQuery(document).ready(function () {
	$(".accordion:not(.active)").css("height", "0px");
	$(".accordion.active").css("height", $(".accordion.active").prop("scrollHeight") + "px");
	
	$("#methods input[type='radio']").change(
		function () {
			$(".accordion.active").css("height", "0px");
			$(".accordion.active").removeClass("active");
			$("#method-" + this.value).addClass("active");
			$(".accordion.active").css("height", $(".accordion.active").prop("scrollHeight") + "px");
			scrollTo("#method");
		}
	);
});

// Enable owlCarousel

jQuery(document).ready(function () {
	$(".owl-carousel").owlCarousel({
		loop: true,
		center: false,
		nav: false,
		autoWidth: true,
		dots: false,
		margin: 32,
		autoplay: true,
		autoplayHoverPause: true,
		responsive: false
	});
});

function scrollTo(id) {
	$("html, body").animate({
		scrollTop: $(id).offset().top
	}, 800);
}

function becomeSupporter() {
	if ($("#method-supporter").hasClass("active")) scrollTo("#method");
	else $("#radio-supporter").click();
}

// Generate SEPA PDF

function genpdf(mode) {
	var user = {
		lastname: getInput("lastname", mode),
		firstname: getInput("firstname", mode),
		street: getInput("street", mode),
		postcode: getInput("zip", mode),
		residence: getInput("residence", mode),
		email: getInput("email", mode),
		newsletter: getInput("newsletter", mode),
		phone: getInput("phone", mode),
		bank: getInput("bank", mode),
		iban: getInput("iban", mode),
		bic: getInput("bic", mode),
		interval: $("input[name='" + mode + "-" + "interval']:checked").val(),
		amount: $("input[name='" + mode + "-" + "amount']:checked").val()
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
	var title = mode === "supporter" ? "Antrag auf Fördermitgliedschaft" : "Lastschriftantrag";
	text(doc, title, 12);
	
	if (mode === "supporter") {
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
	var addText = user.newsletter === "on" ? " Zusätzlich möchte ich den Newsletter abonnieren, um regelmäßig über die Tätigkeiten des Vereins informiert zu werden." : "";
	block(doc, "Ich unterstütze den Arbeitskreis Vorratsdaten Österreich " + user.interval + " mit " + user.amount + " Euro." + addText, 18);
	
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
	fieldColumn(doc, date + ", ", "Datum, Ort", "", "Unterschrift Lastschriftmandat", 16, true);
	
	doc.save("antrag-auf-foerdermitgliedschaft.pdf");
	offset = 15;
}

function getInput(id, mode) {
	var value = $("#" + mode + "-" + id).val();
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
