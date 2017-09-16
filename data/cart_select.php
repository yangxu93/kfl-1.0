<?php
@$uid = $_REQUEST['uid'] or die('uid required');

require('init.php');

$output['uid'] = $uid;

$sql = "SELECT kf_cart.ctid,kf_cart.did,kf_cart.dishCount,kf_dish.name,kf_dish.img_sm,kf_dish.price FROM kf_dish,kf_cart WHERE kf_cart.did=kf_dish.did AND kf_cart.userid='$uid'";
$result = mysqli_query($conn,$sql);
$output['data'] = mysqli_fetch_all($result, MYSQLI_ASSOC);


echo json_encode($output);
