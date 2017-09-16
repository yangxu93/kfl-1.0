<?php
@$uid = $_REQUEST['uid'] or die('uid required');
@$did = $_REQUEST['did'] or die('did required');
@$count = $_REQUEST['count'] or die('did required');

require('init.php');

//判断购物车表中是否已经存在该商品记录
$sql = "SELECT ctid FROM kf_cart WHERE userid=$uid AND did=$did";
$result = mysqli_query($conn,$sql);
$row = mysqli_fetch_assoc($result);
if($row){
  if($count == -1) //之前曾经购买过该商品，则更新购买数量加1
  {
    $sql = "update kf_cart set dishCount=dishCount+1 where userid=$uid AND did=$did";
  }
  else
  {
    $sql = "update kf_cart set dishCount='$count' where userid=$uid AND did=$did";
  }

  mysqli_query($conn,$sql);
  $output['code'] = 2;
  $output['msg'] = 'succ';
}else {    
  $sql = "INSERT INTO kf_cart VALUES(NULL,$uid, $did,1)";
  mysqli_query($conn,$sql);
  $output['code'] = 1;
  $output['msg'] = 'succ';
}

echo json_encode($output);
