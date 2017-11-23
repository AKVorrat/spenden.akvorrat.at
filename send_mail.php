<?php
// Fetching Values from URL.
$lastname = $_POST['lastname'];
$firstname = $_POST['firstname'];
$street = $_POST['street'];
$number = $_POST['number'];
$postcode = $_POST['postcode'];
$residence = $_POST['residence'];
$email = $_POST['email'];
$newsletter = $_POST['newsletter'];
$phone = $_POST['phone'];
$bank = $_POST['bank'];
$iban = $_POST['iban'];
$bic = $_POST['bic'];
$interval = $_POST['interval'];
$amount = $_POST['amount'];

$subject = "Spende an Mosaik";
// To send HTML mail, the Content-type header must be set.
$headers = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
$headers .= 'From:' . 'spenden@mosaik-blog.at'  . "\r\n"; // Sender's Email
/*$headers .= 'Cc:' . $email. "\r\n"; // Carbon copy to Sender*/
$template = '<div style="padding:50px;">Hallo! ' . $name . '<br/>'
. '<br/>Neue Spende<br/><br/>'
. 'Name: ' . $lastname . ' ' . $firstname . '<br/>'
. 'Straße: ' . $street . '<br/>'
. 'Nummer: ' . $number . '<br/>'
. 'Postleitzahl: ' . $postcode . '<br/>'
. 'Ort: ' . $residence . '<br/>'
. 'E-Mail: ' . $email . '<br/>'
. 'Newsletter: ' . $newsletter .'<br/>'
. 'Telefon: ' . $phone . '<br/>'
. 'Bank: ' . $bank . '<br/>'
. 'IBAN: ' . $iban . '<br/>'
. 'BIC: ' . $bic . '<br/>'
. 'Intervall (Spende all x Monate): ' . $interval . '<br/>'
. 'Betrag: ' . $amount
. '<br/>'
. 'Vielen Dank für deine Spende.</div>';
$sendmessage = "<div>" . $template . "</div>";
// Message lines should not exceed 70 characters (PHP rule), so wrap it.
$sendmessage = wordwrap($sendmessage, 70);
// Send mail by PHP Mail Function.
mail("spenden@mosaik-blog.at", $subject, $sendmessage, $headers);
echo "Danke für Ihre Spende! Bitte speichern Sie das generierte PDF für Ihre Unterlagen.";

?>
