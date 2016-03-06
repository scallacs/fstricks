<?= __d('user_tools', 'Hello {0}!', h($user->username)) ?>

<?= __d('user_tools', 'Please click this link to reset your password.') ?>

<?= \Cake\Routing\Router::url('/reset-password?token='.$user->password_token, true) ?>