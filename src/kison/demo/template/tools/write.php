<?php
    $head = "/**\n".
            "* parser for template from kison.\n".
            "* @author yiminghe@gmail.com\n".
            "*/\n".
           "KISSY.add('template/parser', function () {\n";
    $foot = '});';
    $code = $head.$_POST['data']."\n".$foot;
    $file = fopen("../src/parser.js","w");
    fwrite($file,$code);
    fclose($file);

    echo "{status:1}";
?>