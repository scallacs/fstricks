<?= $this->Html->charset() ?>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>
    <?= $this->fetch('title') ?>
</title>

<script>
    const DS = '/';
            const WEBROOT = '<?= $this->request->webroot; ?>';
            const WEBROOT_FULL = '<?= \Cake\Routing\Router::url('/', true); ?>';
            const IMAGE_FOLDER = WEBROOT_FULL + 'img' + DS;
            const HTML_FOLDER = WEBROOT_FULL + 'html' + DS;</script>
    <?= $this->Html->meta('icon') ?>
    <?= $this->Html->css('bootstrap.css') ?>
    <?= $this->Html->css('ui-bootstrap.css') ?>
    <?= $this->Html->css('jquery-ui.min.css'); ?>
    <?= $this->Html->css('base.css') ?>
    <?= $this->Html->css('select.min.css'); ?>  

<?= $this->Html->script('jquery/jquery-2.1.4.min.js'); ?>
<?= $this->Html->script('bib/jquery.timeago.js'); ?>
<?= $this->Html->script('bib/bootstrap.min.js'); ?>  

<?= $this->Html->script('util'); ?>
<?= $this->Html->script('cakephp.util'); ?>


<?= $this->Html->script("lodash.min.js"); ?>

<?= $this->Html->script("https://ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular.min.js"); ?>
<?= $this->Html->script("https://ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular-resource.min.js"); ?>
<?= $this->Html->script("https://ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular-animate.min.js"); ?>
<?= $this->Html->script("https://ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular-route.min.js"); ?>
<?= $this->Html->script("https://ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular-cookies.min.js"); ?>
<?= $this->Html->script("angularjs/angular-simple-logger.min.js"); ?>

<?php // $this->Html->script("angularjs/ui-bootstrap-custom-0.14.3.min.js"); ?>
<?= $this->Html->script("angularjs/ui-bootstrap-custom-tpls-0.14.3.min.js"); ?>
<?= $this->Html->script('jquery-ui/jquery-ui.min.js'); ?>
<?= $this->Html->script('angularjs/select.min.js'); ?>   
<?= $this->Html->script("angularjs/slider.js"); ?>

<?= $this->Html->script('angularjs/CommonModule'); ?>
<?= $this->Html->script('angularjs/DefaultModule'); ?>

<?= $this->Html->css("../js/angular-socialshare/angular-socialshare.min.css"); ?>
<?= $this->Html->script("angular-socialshare/angular-socialshare.min.js"); ?>
<?= $this->Html->script("satellizer/satellizer.min.js"); ?>
<?= $this->Html->script("message-center/message-center.js"); ?>
<script src="http://platform.twitter.com/widgets.js"></script>
