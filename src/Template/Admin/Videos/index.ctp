<nav class="large-3 medium-4 columns" id="actions-sidebar">
    <ul class="side-nav">
        <li class="heading"><?= __('Actions') ?></li>
        <li><?= $this->Html->link(__('New Video'), ['action' => 'add']) ?></li>
        <li><?= $this->Html->link(__('List Video Providers'), ['controller' => 'VideoProviders', 'action' => 'index']) ?></li>
        <li><?= $this->Html->link(__('New Video Provider'), ['controller' => 'VideoProviders', 'action' => 'add']) ?></li>
        <li><?= $this->Html->link(__('List Users'), ['controller' => 'Users', 'action' => 'index']) ?></li>
        <li><?= $this->Html->link(__('New User'), ['controller' => 'Users', 'action' => 'add']) ?></li>
        <li><?= $this->Html->link(__('List Video Tags'), ['controller' => 'VideoTags', 'action' => 'index']) ?></li>
        <li><?= $this->Html->link(__('New Video Tag'), ['controller' => 'VideoTags', 'action' => 'add']) ?></li>
    </ul>
</nav>
<div class="videos index large-9 medium-8 columns content">
    <h3><?= __('Videos') ?></h3>
    <table cellpadding="0" cellspacing="0">
        <thead>
            <tr>
                <th><?= $this->Paginator->sort('id') ?></th>
                <th><?= $this->Paginator->sort('video_url') ?></th>
                <th><?= $this->Paginator->sort('source_id') ?></th>
                <th><?= $this->Paginator->sort('count_tags') ?></th>
                <th><?= $this->Paginator->sort('user_id') ?></th>
                <th class="actions"><?= __('Actions') ?></th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($videos as $video): ?>
            <tr>
                <td><?= $this->Number->format($video->id) ?></td>
                <td><?= h($video->video_url) ?></td>
                <td><?= $video->has('video_provider') ? $this->Html->link($video->video_provider->name, ['controller' => 'VideoProviders', 'action' => 'view', $video->video_provider->name]) : '' ?></td>
                <td><?= $this->Number->format($video->count_tags) ?></td>
                <td><?= $video->has('user') ? $this->Html->link($video->user->username, ['controller' => 'Users', 'action' => 'view', $video->user->id]) : '' ?></td>
                <td class="actions">
                    <?= $this->Html->link(__('View'), ['action' => 'view', $video->id]) ?>
                    <?= $this->Html->link(__('Edit'), ['action' => 'edit', $video->id]) ?>
                    <?= $this->Form->postLink(__('Delete'), ['action' => 'delete', $video->id], ['confirm' => __('Are you sure you want to delete # {0}?', $video->id)]) ?>
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
