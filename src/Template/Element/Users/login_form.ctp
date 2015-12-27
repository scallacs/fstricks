 <?php
if (\Cake\Core\Configure::read('Hybridauth') !== null){
    foreach (\Cake\Core\Configure::read('Hybridauth') as $name => $option){
        if ($option['enabled']){
            echo '<p class="text-center">'.$this->Html->image('social_login/login_'.strtolower($name).'.png', array(
                "alt" => "Signin with $name",
                'url' => array('controller' => 'Users', 'action'=>'social_login', $name)
            )).'</p>';
        }
    }
?>
    <hr/>
    <h3 class="text-center">... Or the Old School way?</h3>
<?php
}

echo $this->Form->create();
?>
<?php
echo $this->Form->input('email');
echo $this->Form->input('password');
?>
<div class="submit">
    <?= $this->Form->submit('Login', array('div' => false, 'name' => 'login'));?>
</div>        
<?php
echo $this->Form->end();
?>
<?= $this->Html->link('Subscribe', array('action' => 'add'));?>
