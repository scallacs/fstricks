<?= $this->Html->charset() ?>
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title  ng-bind-template="{{viewTitle}} - <?php echo \Cake\Core\Configure::read('Company.title'); ?>">
    <?php echo \Cake\Core\Configure::read('Company.title'); ?>
</title>

<?= $this->Html->meta('icon', \Cake\Routing\Router::url('/img/favicon.png', true)); ?>

<meta name="fragment" content="!">
<!--<meta name="description" content="{{seo.metaDescription}}">-->

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
