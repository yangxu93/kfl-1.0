<?php
@$ctid = $_REQUEST['ctid'] or die('ctid required');
require('init.php');
$sql = "DELETE FROM kf_cart WHERE ctid=$ctid";
$result = mysqli_query($conn,$sql);
if($result){
  $output['code']=1;
  $output['msg']='succ';
}else {
  $output['code']=400;
}


echo json_encode($output);
