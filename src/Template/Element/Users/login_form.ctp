 <?php
if (\Cake\Core\Configure::read('HybridAuth') !== null){
    foreach (\Cake\Core\Configure::read('HybridAuth.providers') as $name => $option){
        if ($option['enabled']){
            echo '<p class="text-center">' . $this->Html->link($name, [
                    'controller' => 'Users',
                    'action'=> 'login',
                    strtolower($name)
                ], [
                    'class' => 'btn btn-block btn-facebook'
                ]
            ).'</p>';
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
