<?= $this->Html->charset() ?>
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>
    <?php echo \Cake\Core\Configure::read('Company.title'); ?> | {{SharedData.pageTitle()}}
</title>

<?= $this->Html->meta('icon', \Cake\Routing\Router::url('/img/favicon.png', true)); ?>

<meta name="fragment" content="!">
<!--<meta name="description" content="{{seo.metaDescription}}">-->

<script>
    var WEBROOT_FULL = '<?= \Cake\Routing\Router::url('/', true); ?>';
    var DOMAIN_URL = '<?= \Cake\Routing\Router::fullbaseUrl(); ?>';
    
    var API_BASE_URL = '<?= \Cake\Routing\Router::url('/api', true); ?>';
    var TEMPLATE_URL = '<?= \Cake\Routing\Router::url('/views/default/', true); ?>';
    var APIS = {
        facebook: '<?= \Cake\Core\Configure::read('Facebook.id'); ?>',
        youtube: '<?= \Cake\Core\Configure::read('Youtube.key'); ?>'
    };
    //window.prerenderReady = false;
</script>

<link href="https://cdnjs.cloudflare.com/ajax/libs/angularjs-toaster/1.1.0/toaster.min.css" rel="stylesheet" />

<?php if (\Cake\Core\Configure::read('concat_css')) { ?>
    <?= $this->Html->css('style.min.css', [
        'fullBase' => true
    ]) ?>
<?php } else { ?>
    <?= $this->Html->css('select.css'); ?> 
    <?= $this->Html->css('bootstrap.css') ?>
    <?= $this->Html->css('base.css') ?>
<?php } ?>
