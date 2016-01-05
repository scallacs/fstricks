<nav class="large-3 medium-4 columns" id="actions-sidebar">
    <ul class="side-nav">
        <li class="heading"><?= __('Actions') ?></li>
        <li><?= $this->Html->link(__('New Video Tag Point'), ['action' => 'add']) ?></li>
        <li><?= $this->Html->link(__('List Users'), ['controller' => 'Users', 'action' => 'index']) ?></li>
        <li><?= $this->Html->link(__('New User'), ['controller' => 'Users', 'action' => 'add']) ?></li>
        <li><?= $this->Html->link(__('List Video Tags'), ['controller' => 'VideoTags', 'action' => 'index']) ?></li>
        <li><?= $this->Html->link(__('New Video Tag'), ['controller' => 'VideoTags', 'action' => 'add']) ?></li>
    </ul>
</nav>
<div class="videoTagPoints index large-9 medium-8 columns content">
    <h3><?= __('Video Tag Points') ?></h3>
    <table cellpadding="0" cellspacing="0">
        <thead>
            <tr>
                <th><?= $this->Paginator->sort('id') ?></th>
                <th><?= $this->Paginator->sort('value') ?></th>
                <th><?= $this->Paginator->sort('users_id') ?></th>
                <th><?= $this->Paginator->sort('video_tag_id') ?></th>
                <th class="actions"><?= __('Actions') ?></th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($videoTagPoints as $videoTagPoint): ?>
            <tr>
                <td><?= $this->Number->format($videoTagPoint->id) ?></td>
                <td><?= h($videoTagPoint->value) ?></td>
                <td><?= $videoTagPoint->has('user') ? $this->Html->link($videoTagPoint->user->username, ['controller' => 'Users', 'action' => 'view', $videoTagPoint->user->id]) : '' ?></td>
                <td><?= $videoTagPoint->has('video_tag') ? $this->Html->link($videoTagPoint->video_tag->id, ['controller' => 'VideoTags', 'action' => 'view', $videoTagPoint->video_tag->id]) : '' ?></td>
                <td class="actions">
                    <?= $this->Html->link(__('View'), ['action' => 'view', $videoTagPoint->id]) ?>
                    <?= $this->Html->link(__('Edit'), ['action' => 'edit', $videoTagPoint->id]) ?>
                    <?= $this->Form->postLink(__('Delete'), ['action' => 'delete', $videoTagPoint->id], ['confirm' => __('Are you sure you want to delete # {0}?', $videoTagPoint->id)]) ?>
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
