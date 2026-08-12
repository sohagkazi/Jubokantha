<?php
echo "Killing Node processes...<br>";
exec('pkill -f node', $output, $return_var);
echo "Result: " . $return_var . "<br>";
print_r($output);

echo "<br>Killing npm processes...<br>";
exec('pkill -f npm', $output2, $return_var2);
echo "Result: " . $return_var2 . "<br>";
print_r($output2);
?>