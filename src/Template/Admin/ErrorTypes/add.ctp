<nav class="large-3 medium-4 columns" id="actions-sidebar">
    <ul class="side-nav">
        <li class="heading"><?= __('Actions') ?></li>
        <li><?= $this->Html->link(__('List Error Types'), ['action' => 'index']) ?></li>
        <li><?= $this->Html->link(__('List Report Errors'), ['controller' => 'ReportErrors', 'action' => 'index']) ?></li>
        <li><?= $this->Html->link(__('New Report Error'), ['controller' => 'ReportErrors', 'action' => 'add']) ?></li>
    </ul>
</nav>
<div class="errorTypes form large-9 medium-8 columns content">
    <?= $this->Form->create($errorType) ?>
    <fieldset>
        <legend><?= __('Add Error Type') ?></legend>
        <?php
            echo $this->Form->input('name');
            echo $this->Form->input('description');
        ?>
    </fieldset>
    <?= $this->Form->button(__('Submit')) ?>
    <?= $this->Form->end() ?>
</div>
