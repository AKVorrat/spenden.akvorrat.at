<?php
// Fetching Values from URL.
$lastname = $_POST['lastname'];
$fristname = $_POST['firstname'];
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
$headers .= 'From:' . 'spende@mosaik-blog.at'  . "\r\n"; // Sender's Email
/*$headers .= 'Cc:' . $email. "\r\n"; // Carbon copy to Sender*/
$template = '<div style="padding:50px; color:white;">Hello ' . $name . ',<br/>'
. '<br/>Neue Spende<br/><br/>'
. 'Name:' . $lastname . ' ' . $firstname . '<br/>'
. 'Straße:' . $street . '<br/>'
. 'Nummer:' . $number . '<br/>'
. 'Postleitzahl:' . $postcode . '<br/>'
. 'Ort:' . $residence . '<br/>'
. 'E-Mail:' . $email . '<br/>'
. 'Newsletter:' . $newsletter .'<br/>'
. 'Telefon:' . $phone . '<br/>'
. 'Bank:' . $bank . '<br/>'
. 'IBAN:' . $iban . '<br/>'
. 'BIC:' . $bic . '<br/>'
. 'Intervall' . $interval . '<br/>'
. 'Betrag' . $amount
. '<br/>'
. 'Vielen Dank für deine Spende.</div>';
$sendmessage = "<div style=\"background-color:#7E7E7E; color:white;\">" . $template . "</div>";
// Message lines should not exceed 70 characters (PHP rule), so wrap it.
$sendmessage = wordwrap($sendmessage, 70);
// Send mail by PHP Mail Function.
mail("martin@convive.io", $subject, $sendmessage, $headers);
echo "Danke für Ihre Spende! Bitte speihcern Sie das generierte PDF für Ihre Unterlagen.";

?>
