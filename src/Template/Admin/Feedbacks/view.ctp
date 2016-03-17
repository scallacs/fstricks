<nav class="large-3 medium-4 columns" id="actions-sidebar">
    <ul class="side-nav">
        <li class="heading"><?= __('Actions') ?></li>
        <li><?= $this->Html->link(__('Edit Feedback'), ['action' => 'edit', $feedback->id]) ?> </li>
        <li><?= $this->Form->postLink(__('Delete Feedback'), ['action' => 'delete', $feedback->id], ['confirm' => __('Are you sure you want to delete # {0}?', $feedback->id)]) ?> </li>
        <li><?= $this->Html->link(__('List Feedbacks'), ['action' => 'index']) ?> </li>
        <li><?= $this->Html->link(__('New Feedback'), ['action' => 'add']) ?> </li>
        <li><?= $this->Html->link(__('List Users'), ['controller' => 'Users', 'action' => 'index']) ?> </li>
        <li><?= $this->Html->link(__('New User'), ['controller' => 'Users', 'action' => 'add']) ?> </li>
    </ul>
</nav>
<div class="feedbacks view large-9 medium-8 columns content">
    <h3><?= h($feedback->id) ?></h3>
    <table class="vertical-table">
        <tr>
            <th><?= __('Url') ?></th>
            <td><?= h($feedback->url) ?></td>
        </tr>
        <tr>
            <th><?= __('User') ?></th>
            <td><?= $feedback->has('user') ? $this->Html->link($feedback->user->username, ['controller' => 'Users', 'action' => 'view', $feedback->user->id]) : '' ?></td>
        </tr>
        <tr>
            <th><?= __('Id') ?></th>
            <td><?= $this->Number->format($feedback->id) ?></td>
        </tr>
        <tr>
            <th><?= __('Created') ?></th>
            <td><?= h($feedback->created) ?></td>
        </tr>
    </table>
    <div class="row">
        <h4><?= __('Browser') ?></h4>
        <?= $this->Text->autoParagraph(h($feedback->browser)); ?>
    </div>
    <div class="row">
        <h4><?= __('Note') ?></h4>
        <?= $this->Text->autoParagraph(h($feedback->note)); ?>
    </div>
    <div class="row">
        <h4><?= __('Img') ?></h4>
        <?= $this->Text->autoParagraph(h($feedback->img)); ?>
    </div>
    <div class="row">
        <h4><?= __('Html') ?></h4>
        <?= $this->Text->autoParagraph(h($feedback->html)); ?>
    </div>
    <div class="row">
        <h4><?= __('Status') ?></h4>
        <?= $this->Text->autoParagraph(h($feedback->status)); ?>
    </div>
</div>
