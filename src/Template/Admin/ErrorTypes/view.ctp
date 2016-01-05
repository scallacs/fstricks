<nav class="large-3 medium-4 columns" id="actions-sidebar">
    <ul class="side-nav">
        <li class="heading"><?= __('Actions') ?></li>
        <li><?= $this->Html->link(__('Edit Error Type'), ['action' => 'edit', $errorType->id]) ?> </li>
        <li><?= $this->Form->postLink(__('Delete Error Type'), ['action' => 'delete', $errorType->id], ['confirm' => __('Are you sure you want to delete # {0}?', $errorType->id)]) ?> </li>
        <li><?= $this->Html->link(__('List Error Types'), ['action' => 'index']) ?> </li>
        <li><?= $this->Html->link(__('New Error Type'), ['action' => 'add']) ?> </li>
        <li><?= $this->Html->link(__('List Report Errors'), ['controller' => 'ReportErrors', 'action' => 'index']) ?> </li>
        <li><?= $this->Html->link(__('New Report Error'), ['controller' => 'ReportErrors', 'action' => 'add']) ?> </li>
    </ul>
</nav>
<div class="errorTypes view large-9 medium-8 columns content">
    <h3><?= h($errorType->name) ?></h3>
    <table class="vertical-table">
        <tr>
            <th><?= __('Name') ?></th>
            <td><?= h($errorType->name) ?></td>
        </tr>
        <tr>
            <th><?= __('Id') ?></th>
            <td><?= $this->Number->format($errorType->id) ?></td>
        </tr>
    </table>
    <div class="row">
        <h4><?= __('Description') ?></h4>
        <?= $this->Text->autoParagraph(h($errorType->description)); ?>
    </div>
    <div class="related">
        <h4><?= __('Related Report Errors') ?></h4>
        <?php if (!empty($errorType->report_errors)): ?>
        <table cellpadding="0" cellspacing="0">
            <tr>
                <th><?= __('Id') ?></th>
                <th><?= __('User Id') ?></th>
                <th><?= __('Error Type Id') ?></th>
                <th><?= __('Video Tag Id') ?></th>
                <th><?= __('Comment') ?></th>
                <th><?= __('Created') ?></th>
                <th class="actions"><?= __('Actions') ?></th>
            </tr>
            <?php foreach ($errorType->report_errors as $reportErrors): ?>
            <tr>
                <td><?= h($reportErrors->id) ?></td>
                <td><?= h($reportErrors->user_id) ?></td>
                <td><?= h($reportErrors->error_type_id) ?></td>
                <td><?= h($reportErrors->video_tag_id) ?></td>
                <td><?= h($reportErrors->comment) ?></td>
                <td><?= h($reportErrors->created) ?></td>
                <td class="actions">
                    <?= $this->Html->link(__('View'), ['controller' => 'ReportErrors', 'action' => 'view', $reportErrors->id]) ?>

                    <?= $this->Html->link(__('Edit'), ['controller' => 'ReportErrors', 'action' => 'edit', $reportErrors->id]) ?>

                    <?= $this->Form->postLink(__('Delete'), ['controller' => 'ReportErrors', 'action' => 'delete', $reportErrors->id], ['confirm' => __('Are you sure you want to delete # {0}?', $reportErrors->id)]) ?>

                </td>
            </tr>
            <?php endforeach; ?>
        </table>
    <?php endif; ?>
    </div>
</div>
