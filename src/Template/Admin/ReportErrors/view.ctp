<nav class="large-3 medium-4 columns" id="actions-sidebar">
    <ul class="side-nav">
        <li class="heading"><?= __('Actions') ?></li>
        <li><?= $this->Html->link(__('Edit Report Error'), ['action' => 'edit', $reportError->id]) ?> </li>
        <li><?= $this->Form->postLink(__('Delete Report Error'), ['action' => 'delete', $reportError->id], ['confirm' => __('Are you sure you want to delete # {0}?', $reportError->id)]) ?> </li>
        <li><?= $this->Html->link(__('List Report Errors'), ['action' => 'index']) ?> </li>
        <li><?= $this->Html->link(__('New Report Error'), ['action' => 'add']) ?> </li>
        <li><?= $this->Html->link(__('List Users'), ['controller' => 'Users', 'action' => 'index']) ?> </li>
        <li><?= $this->Html->link(__('New User'), ['controller' => 'Users', 'action' => 'add']) ?> </li>
        <li><?= $this->Html->link(__('List Error Types'), ['controller' => 'ErrorTypes', 'action' => 'index']) ?> </li>
        <li><?= $this->Html->link(__('New Error Type'), ['controller' => 'ErrorTypes', 'action' => 'add']) ?> </li>
        <li><?= $this->Html->link(__('List Video Tags'), ['controller' => 'VideoTags', 'action' => 'index']) ?> </li>
        <li><?= $this->Html->link(__('New Video Tag'), ['controller' => 'VideoTags', 'action' => 'add']) ?> </li>
    </ul>
</nav>
<div class="reportErrors view large-9 medium-8 columns content">
    <h3><?= h($reportError->id) ?></h3>
    <table class="vertical-table">
        <tr>
            <th><?= __('User') ?></th>
            <td><?= $reportError->has('user') ? $this->Html->link($reportError->user->username, ['controller' => 'Users', 'action' => 'view', $reportError->user->id]) : '' ?></td>
        </tr>
        <tr>
            <th><?= __('Error Type') ?></th>
            <td><?= $reportError->has('error_type') ? $this->Html->link($reportError->error_type->name, ['controller' => 'ErrorTypes', 'action' => 'view', $reportError->error_type->id]) : '' ?></td>
        </tr>
        <tr>
            <th><?= __('Video Tag') ?></th>
            <td><?= $reportError->has('video_tag') ? $this->Html->link($reportError->video_tag->id, ['controller' => 'VideoTags', 'action' => 'view', $reportError->video_tag->id]) : '' ?></td>
        </tr>
        <tr>
            <th><?= __('Id') ?></th>
            <td><?= $this->Number->format($reportError->id) ?></td>
        </tr>
        <tr>
            <th><?= __('Created') ?></th>
            <td><?= h($reportError->created) ?></td>
        </tr>
    </table>
    <div class="row">
        <h4><?= __('Comment') ?></h4>
        <?= $this->Text->autoParagraph(h($reportError->comment)); ?>
    </div>
</div>
