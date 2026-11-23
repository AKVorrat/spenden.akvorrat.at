<?php

require_once(__DIR__ . '/../vendor/autoload.php');

use Mpay24\Mpay24;
use Mpay24\Mpay24Order;
use Mpay24\Mpay24Config;

$env = parse_ini_file(__DIR__ . '/../.env');

$mpay24_config = new Mpay24Config($env['MPAY24_MERCHANT_ID'], $env['MPAY24_SOAP_PASS']);
$mpay24_config->useTestSystem($env['MPAY24_TEST_SYSTEM'] === "true");
$mpay24_config->setDebug($env['MPAY24_DEBUG'] === "true");
$mpay24 = new Mpay24($mpay24_config);

$mdxi = new Mpay24Order();
$mdxi->Order->Tid = "1";

# PaymentType
$mdxi->Order->PaymentTypes->setEnable("true");
$mdxi->Order->PaymentTypes->Payment(1)->setType($_GET['paymentProvider']);


$mdxi->Order->ShoppingCart->Item(1)->Number = "1";
$mdxi->Order->ShoppingCart->Item(1)->Description = "Spende";
$mdxi->Order->ShoppingCart->Item(1)->Quantity = "1";
$mdxi->Order->ShoppingCart->Item(1)->ItemPrice = $_GET['amount'];
$mdxi->Order->ShoppingCart->Item(1)->Price = $_GET['amount'];

$mdxi->Order->Price = $_GET['amount'];
$mdxi->Order->Currency = 'EUR';
$mdxi->Order->URL->Success = $env['ROOT_URL']."/danke.html";
$mdxi->Order->URL->Error = $env['ROOT_URL']."/fehler.html";

$redirect_url = $mpay24->paymentPage($mdxi)->getLocation();

echo json_encode([
  "redirectUrl" => $redirect_url
]);
