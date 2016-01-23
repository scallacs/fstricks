<?php
$this->assign('title', Cake\Core\Configure::read('Company.name'));
?>
<!-- angular templating -->
<!-- this is where content will be injected -->
<div ng-view></div>