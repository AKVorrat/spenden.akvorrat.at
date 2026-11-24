<?php

require_once(__DIR__ . '/../vendor/autoload.php');

use Mpay24\Mpay24;
use Mpay24\Mpay24Order;
use Mpay24\Mpay24Config;

header('Content-Type: application/json');

// Only accept what the donation page sends: EPS and an amount of at least 5 EUR
// (same minimum as the amount input field).
$payment_provider = $_GET['paymentProvider'] ?? '';
$amount = filter_var($_GET['amount'] ?? '', FILTER_VALIDATE_FLOAT);
if ($payment_provider !== 'EPS' || $amount === false || !is_finite($amount) || $amount < 5) {
  http_response_code(400);
  echo json_encode(["error" => "invalid request"]);
  exit;
}
$amount = number_format($amount, 2, '.', '');

$env = parse_ini_file(__DIR__ . '/../.env');

$mpay24_config = new Mpay24Config($env['MPAY24_MERCHANT_ID'], $env['MPAY24_SOAP_PASS']);
$mpay24_config->useTestSystem($env['MPAY24_TEST_SYSTEM'] === "true");
$mpay24_config->setDebug($env['MPAY24_DEBUG'] === "true");
$mpay24 = new Mpay24($mpay24_config);

// Language of the donation page the request came from. Only "de" and "en" exist.
$lang = ($_GET['lang'] ?? '') === 'en' ? 'en' : 'de';
$page_prefix = $lang === 'en' ? '/en' : '';

$mdxi = new Mpay24Order();
$mdxi->Order->Tid = "1";
$mdxi->Order->TemplateSet->setLanguage(strtoupper($lang));

# PaymentType
$mdxi->Order->PaymentTypes->setEnable("true");
$mdxi->Order->PaymentTypes->Payment(1)->setType($payment_provider);


$mdxi->Order->ShoppingCart->Item(1)->Number = "1";
$mdxi->Order->ShoppingCart->Item(1)->Description = $lang === 'en' ? "Donation" : "Spende";
$mdxi->Order->ShoppingCart->Item(1)->Quantity = "1";
$mdxi->Order->ShoppingCart->Item(1)->ItemPrice = $amount;
$mdxi->Order->ShoppingCart->Item(1)->Price = $amount;

$mdxi->Order->Price = $amount;
$mdxi->Order->Currency = 'EUR';
$mdxi->Order->URL->Success = $env['ROOT_URL'].$page_prefix."/danke.html";
$mdxi->Order->URL->Error = $env['ROOT_URL'].$page_prefix."/fehler.html";

$redirect_url = $mpay24->paymentPage($mdxi)->getLocation();

echo json_encode([
  "redirectUrl" => $redirect_url
]);
