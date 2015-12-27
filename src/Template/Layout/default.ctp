<!DOCTYPE html>
<html>
<head>
    <?= $this->Element('Common/head');?>
    
    <?= $this->fetch('meta') ?>
    <?= $this->fetch('css') ?>
    <?= $this->fetch('script') ?>

</head>
<body ng-app="DefaultModule" ng-controller="MainController">
    
    <?= $this->Element('Common/header_ajs');?>
    
    <div id="container">
        <div id="content" class="">
            <?= $this->fetch('content') ?>
        </div>
    </div>
    
    <?= $this->Element('Common/footer');?>
</body>
</html>