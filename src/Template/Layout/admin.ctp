<!DOCTYPE html>
<html ng-app="app.admin">
    <head>
        <?= $this->Element('Common/head'); ?>
        <?= $this->Element('Common/scripts'); ?>

        <meta charset="utf-8">
        <title>Freestyle Tricks Administration</title>

        <?= $this->Html->script('components.js'); ?>
        <?= $this->Html->script('components/ng-admin/build/ng-admin.min.js'); ?>
        <?= $this->Html->css('/js/components/ng-admin/build/ng-admin.min.css'); ?>
        <?= $this->Html->script(\Cake\Core\Configure::read('admin_hidden_prefix') . '.js'); ?>

        <script type="text/javascript">
            var ADMIN_API_BASE_URL = '<?= \Cake\Routing\Router::url('/admin/api/', true); ?>';
            var ADMIN_TEMPLATE_URL = '<?= \Cake\Routing\Router::url('/views/' . \Cake\Core\Configure::read('admin_hidden_prefix'), true) . '/'; ?>';
        </script>

    </head>
    <body>
    <base href="<?= \Cake\Routing\Router::url('/admin/'); ?>"/>
    <div ui-view></div>
</body>
</html>