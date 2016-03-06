<!DOCTYPE html>
<html>
<head>
    <?= $this->Element('Common/head');?>
    <?= $this->Html->script('angularjs/AdminModule'); ?>

    <?= $this->fetch('meta') ?>
    <?= $this->fetch('css') ?>
    <?= $this->fetch('script') ?>

</head>
<body ng-app="AdminModule" >
    
    <?= $this->Element('Admin/header');?>
    
    <div id="container" class="container-fluid">
        <div id="content" class="container-fluid">
            <?= $this->Flash->render() ?>

            <div class="row">
                <?= $this->fetch('content') ?>
            </div>
        </div>
    </div>
    
    <?= $this->Element('Common/footer');?>
</body>
</html>