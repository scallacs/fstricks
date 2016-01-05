<nav class="large-3 medium-4 columns" id="actions-sidebar">
    <ul class="side-nav">
        <li class="heading"><?= __('Actions') ?></li>
        <li><?= $this->Html->link(__('List Report Errors'), ['action' => 'index']) ?></li>
        <li><?= $this->Html->link(__('List Users'), ['controller' => 'Users', 'action' => 'index']) ?></li>
        <li><?= $this->Html->link(__('New User'), ['controller' => 'Users', 'action' => 'add']) ?></li>
        <li><?= $this->Html->link(__('List Error Types'), ['controller' => 'ErrorTypes', 'action' => 'index']) ?></li>
        <li><?= $this->Html->link(__('New Error Type'), ['controller' => 'ErrorTypes', 'action' => 'add']) ?></li>
        <li><?= $this->Html->link(__('List Video Tags'), ['controller' => 'VideoTags', 'action' => 'index']) ?></li>
        <li><?= $this->Html->link(__('New Video Tag'), ['controller' => 'VideoTags', 'action' => 'add']) ?></li>
    </ul>
</nav>
<div class="reportErrors form large-9 medium-8 columns content">
    <?= $this->Form->create($reportError) ?>
    <fieldset>
        <legend><?= __('Add Report Error') ?></legend>
        <?php
            echo $this->Form->input('user_id', ['options' => $users, 'empty' => true]);
            echo $this->Form->input('error_type_id', ['options' => $errorTypes]);
            echo $this->Form->input('video_tag_id', ['options' => $videoTags]);
            echo $this->Form->input('comment');
        ?>
    </fieldset>
    <?= $this->Form->button(__('Submit')) ?>
    <?= $this->Form->end() ?>
</div>
