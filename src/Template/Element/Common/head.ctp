<?= $this->Html->charset() ?>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<!--<meta http-equiv="X-UA-Compatible" content="IE=9" />-->

<title>
    <?php echo \Cake\Core\Configure::read('Company.title'); ?>
</title>

<?= $this->Html->meta('icon', 'img/favicon.png'); ?>

<script>
    var WEBROOT_FULL = '<?= \Cake\Routing\Router::url('/', true); ?>';
    var API_BASE_URL = '<?= \Cake\Routing\Router::url('/api', true); ?>';
    var TEMPLATE_URL = '<?= \Cake\Routing\Router::url('/js/src', true); ?>';
    var APIS = {
        facebook: '<?= \Cake\Core\Configure::read('Facebook.id');?>',
        youtube: '<?= \Cake\Core\Configure::read('Youtube.key');?>'
    };
</script>

<link href="https://cdnjs.cloudflare.com/ajax/libs/angularjs-toaster/1.1.0/toaster.min.css" rel="stylesheet" />

<?php if (!\Cake\Core\Configure::read('debug')) { ?>
    <?= $this->Html->css('style.css') ?>
<?php } else { ?>
    <?= $this->Html->css('select.css'); ?> 
    <?= $this->Html->css('bootstrap.css') ?>
    <?= $this->Html->css('base.css') ?>
<?php } ?>
