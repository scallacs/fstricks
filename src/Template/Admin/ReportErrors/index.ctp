<nav class="large-3 medium-4 columns" id="actions-sidebar">
    <ul class="side-nav">
        <li class="heading"><?= __('Actions') ?></li>
        <li><?= $this->Html->link(__('New Report Error'), ['action' => 'add']) ?></li>
        <li><?= $this->Html->link(__('List Users'), ['controller' => 'Users', 'action' => 'index']) ?></li>
        <li><?= $this->Html->link(__('New User'), ['controller' => 'Users', 'action' => 'add']) ?></li>
        <li><?= $this->Html->link(__('List Error Types'), ['controller' => 'ErrorTypes', 'action' => 'index']) ?></li>
        <li><?= $this->Html->link(__('New Error Type'), ['controller' => 'ErrorTypes', 'action' => 'add']) ?></li>
        <li><?= $this->Html->link(__('List Video Tags'), ['controller' => 'VideoTags', 'action' => 'index']) ?></li>
        <li><?= $this->Html->link(__('New Video Tag'), ['controller' => 'VideoTags', 'action' => 'add']) ?></li>
    </ul>
</nav>
<div class="reportErrors index large-9 medium-8 columns content">
    <h3><?= __('Report Errors') ?></h3>
    <table cellpadding="0" cellspacing="0">
        <thead>
            <tr>
                <th><?= $this->Paginator->sort('id') ?></th>
                <th><?= $this->Paginator->sort('user_id') ?></th>
                <th><?= $this->Paginator->sort('error_type_id') ?></th>
                <th><?= $this->Paginator->sort('video_tag_id') ?></th>
                <th><?= $this->Paginator->sort('created') ?></th>
                <th class="actions"><?= __('Actions') ?></th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($reportErrors as $reportError): ?>
            <tr>
                <td><?= $this->Number->format($reportError->id) ?></td>
                <td><?= $reportError->has('user') ? $this->Html->link($reportError->user->username, ['controller' => 'Users', 'action' => 'view', $reportError->user->id]) : '' ?></td>
                <td><?= $reportError->has('error_type') ? $this->Html->link($reportError->error_type->name, ['controller' => 'ErrorTypes', 'action' => 'view', $reportError->error_type->id]) : '' ?></td>
                <td><?= $reportError->has('video_tag') ? $this->Html->link($reportError->video_tag->id, ['controller' => 'VideoTags', 'action' => 'view', $reportError->video_tag->id]) : '' ?></td>
                <td><?= h($reportError->created) ?></td>
                <td class="actions">
                    <?= $this->Html->link(__('View'), ['action' => 'view', $reportError->id]) ?>
                    <?= $this->Html->link(__('Edit'), ['action' => 'edit', $reportError->id]) ?>
                    <?= $this->Form->postLink(__('Delete'), ['action' => 'delete', $reportError->id], ['confirm' => __('Are you sure you want to delete # {0}?', $reportError->id)]) ?>
                </td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
    <div class="paginator">
        <ul class="pagination">
            <?= $this->Paginator->prev('< ' . __('previous')) ?>
            <?= $this->Paginator->numbers() ?>
            <?= $this->Paginator->next(__('next') . ' >') ?>
        </ul>
        <p><?= $this->Paginator->counter() ?></p>
    </div>
</div>
