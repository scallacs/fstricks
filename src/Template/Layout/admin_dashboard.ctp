<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Freestyle Tricks Administration</title>

        <?= $this->Html->script('components.js'); ?>
        <?= $this->Html->script('components/ng-admin/build/ng-admin.min.js'); ?>
        <?= $this->Html->css('/js/components/ng-admin/build/ng-admin.min.css'); ?>

        <script type="text/javascript">
            var ADMIN_API_BASE_URL = '<?= \Cake\Routing\Router::url('/admin/api/', true); ?>';
            var ADMIN_TEMPLATE_URL = '<?= \Cake\Routing\Router::url('/views/' . \Cake\Core\Configure::read('admin_hidden_prefix'), true) . '/'; ?>';
        </script>

        <?= $this->Html->script(\Cake\Core\Configure::read('admin_hidden_prefix') . '.js'); ?>
    </head>
    <body ng-app="app.admin.dashboard">
        <div ui-view></div>
    </body>
</html>