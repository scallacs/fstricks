<!DOCTYPE html>
<html ng-app="app.admin" ng-strict-di>
    <head>
        <meta charset="utf-8">
        <title>Freestyle Tricks Administration</title>

        <?= $this->Element('Common/head'); ?>
        <?= $this->Element('Common/scripts'); ?>

        <?= $this->Html->script('components/ng-admin/build/ng-admin.min.js'); ?>
        <?= $this->Html->css('/js/components/ng-admin/build/ng-admin.min.css'); ?>
        <?= $this->Html->script(\Cake\Core\Configure::read('admin_hidden_prefix') . '.js'); ?>

    </head>
    <body>
    <base href="<?= \Cake\Routing\Router::url('/admin/'); ?>"/>
    <div ui-view></div>
</body>
</html>