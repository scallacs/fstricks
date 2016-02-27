<nav class="large-3 medium-4 columns" id="actions-sidebar">
    <ul class="side-nav">
        <li class="heading"><?= __('Actions') ?></li>
        <li><?= $this->Html->link(__('List Video Tags'), ['action' => 'index']) ?></li>
        <li><?= $this->Html->link(__('List Videos'), ['controller' => 'Videos', 'action' => 'index']) ?></li>
        <li><?= $this->Html->link(__('New Video'), ['controller' => 'Videos', 'action' => 'add']) ?></li>
        <li><?= $this->Html->link(__('List Tags'), ['controller' => 'Tags', 'action' => 'index']) ?></li>
        <li><?= $this->Html->link(__('New Tag'), ['controller' => 'Tags', 'action' => 'add']) ?></li>
        <li><?= $this->Html->link(__('List Users'), ['controller' => 'Users', 'action' => 'index']) ?></li>
        <li><?= $this->Html->link(__('New User'), ['controller' => 'Users', 'action' => 'add']) ?></li>
        <li><?= $this->Html->link(__('List Video Tag Points'), ['controller' => 'VideoTagPoints', 'action' => 'index']) ?></li>
        <li><?= $this->Html->link(__('New Video Tag Point'), ['controller' => 'VideoTagPoints', 'action' => 'add']) ?></li>
    </ul>
</nav>
<div class="videoTags form large-9 medium-8 columns content">
    <?= $this->Form->create($videoTag) ?>
    <fieldset>
        <legend><?= __('Add Video Tag') ?></legend>
        <?php
            echo $this->Form->input('video_url', ['options' => $videos]);
            echo $this->Form->input('tag_id', ['options' => $tags]);
            echo $this->Form->input('user_id', ['options' => $users, 'empty' => true]);
            echo $this->Form->input('begin');
            echo $this->Form->input('end');
            echo $this->Form->input('status');
            echo $this->Form->input('count_points');
        ?>
    </fieldset>
    <?= $this->Form->button(__('Submit')) ?>
    <?= $this->Form->end() ?>
</div>
