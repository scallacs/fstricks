<!DOCTYPE html>
<html>
<head>
    <?= $this->Element('Common/head');?>
    
    <?php if (\Cake\Core\Configure::read('debug')){?>
    
        <?= $this->Html->script('admin/app.admin.module.js'); ?>
        <?= $this->Html->script('admin/app.admin.api.js'); ?>
        <?= $this->Html->script('admin/app.admin.routes.js'); ?>
        <?= $this->Html->script('admin/dashboard/dashboard.controller.js'); ?>
        <?= $this->Html->script('admin/video-tags/video-tags.controller.js'); ?>
        <?= $this->Html->script('admin/users/users.controller.js'); ?>
    
    <?php } else { ?>
    
        <?= $this->Html->script('moFEJPQQS320909j2309923II2ODI2993.js'); ?>
    
    <?php } ?>

<script>
    var ADMIN_API_BASE_URL = '<?= \Cake\Routing\Router::url('/admin/api', true); ?>';
</script>

    <?= $this->fetch('meta') ?>
    <?= $this->fetch('css') ?>
    <?= $this->fetch('script') ?>

</head>
<body ng-app="app.admin" ng-controller="MainAdminController as main" id="ng-app">
    <base href="<?= \Cake\Routing\Router::url('/admin/'); ?>"/>
    <toaster-container toaster-options="{'close-button': true}"></toaster-container>
    
    <?= $this->Element('Admin/header');?>
    
    <div id="container" style="position: relative;" class="clearfix">

        <div page-loader is-loading="SharedData.loadingState"></div>

        <div id="content">
            <div ui-view></div>
        </div>
    </div>
    
    <?= $this->Element('Common/footer');?>
</body>
</html>