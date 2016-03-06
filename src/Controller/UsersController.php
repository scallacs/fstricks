<?php

namespace App\Controller;

use App\Controller\AppController;
use App\Lib\ResultMessage;
use Cake\Utility\Security;

/**
 * Users Controller
 *
 * @property \App\Model\Table\UsersTable $Users
 */
class UsersController extends AppController {

    public function initialize() {
        parent::initialize();
//
//        $this->loadComponent('Burzum/UserTools.UserTool', [
//            'requestPassword' => [
//                'successFlashOptions' => [],
//                'successRedirectUrl' => false,
//                'errorFlashOptions' => [],
//                'errorRedirectUrl' => false,
//                'field' => 'email',
//                'setEntity' => true,
//            ],
//            'resetPassword' => [
//                'successFlashOptions' => [],
//                'successRedirectUrl' => '/login',
//                'errorFlashOptions' => [],
//                'errorRedirectUrl' => '/login',
//                'invalidErrorFlashOptions' => [],
//                'invalidErrorRedirectUrl' => '/login',
//                'expiredErrorFlashOptions' => [],
//                'expiredErrorRedirectUrl' => '/login',
//                'queryParam' => 'token',
//                'tokenOptions' => [],
//            ],
////            'actionMap' => [
////                'reset_password' => [
////                    'method' => 'resetPassword',
////                    'view' => false,
////                ],
////                'request_password' => [
////                    'method' => 'requestPassword',
////                    'view' => false
////                ],
////            ],
//        ]);

        if ($this->request->action === 'signup') {
            $this->loadComponent('Recaptcha.Recaptcha');
        }
    }

    public function beforeFilter(\Cake\Event\Event $event) {
        $this->Auth->allow(['add', 'token', 'profile', 'login', 'signup', 'username_exists', 'facebook_login',
            'logout', 'reset_password', 'request_password']);
    }

    /* ========================================================================
     * API
     */

    /**
     * 
     */
    public function profile($id = null) {
        if ($id === null) {
            $id = $this->Auth->user('username');
        }

        if (!$this->request->is('json')) {
            $this->set('profileId', $id);
        } else {
            $data = $this->Users->find('all')
                    ->where(['Users.username' => $id]);
            ResultMessage::overwriteData($data->first());
            ResultMessage::setWrapper(false);
        }
    }

    public function login() {
        ResultMessage::setWrapper(true);
        if ($this->request->is('post')) {
            $user = $this->Auth->identify();
            if ($user) {
                $this->Auth->setUser($user);
                $this->setUserResponse($user);
//                ResultMessage::setRedirectUrl($this->Auth->redirectUrl());
                ResultMessage::setMessage("Welcome back !", true);
            } else {
                ResultMessage::setMessage('Your username or password is incorrect', false);
            }
        }
    }

    public function username_exists() {
        $username = \App\Lib\DataUtil::getLowerString($this->request->query, 'q', null);
        ResultMessage::setWrapper(false);
        if ($username !== null) {
            $exists = $this->Users->exists(['Users.username' => $username]);
            ResultMessage::setData('exists', $exists);
        } else {
            ResultMessage::setData('exists', false);
        }
    }

    public function facebook_login() {
        $provider = 'facebook';
        //initialize facebook sdk
        try {
            $facebook = new \Facebook\Facebook(array(
                'redirect_uri' => \Cake\Routing\Router::url('/', true),
                'app_id' => \Cake\Core\Configure::read('Facebook.id'),
                'app_secret' => \Cake\Core\Configure::read('Facebook.key')
            ));

            $code = $this->request->data['code'];
            $oauth2 = $facebook->getOAuth2Client();
            $accessToken = $oauth2->getAccessTokenFromCode($code, \Cake\Routing\Router::url('/', true));

            if (!isset($accessToken)) {
                ResultMessage::setMessage('Cannot get Facebook access token', false);
                return;
            }
            try {
                // Proceed knowing you have a logged in user who's authenticated.
                $response = $facebook->get('/me?scope=email&fields=name,email', $accessToken); //user
                $me = $response->getGraphUser();
            } catch (\Facebook\Exceptions\FacebookApiException $e) {
                //echo error_log($e);
                ResultMessage::setMessage('Sorry but we cannot log you in with ' . ucfirst($provider) . ' right now.', false);
                return;
            }
            // TODO catch all

            $providerInfo = [
                'displayName' => $me->getName(),
                'identifier' => $me->getId(),
                'email' => $me->getEmail()
            ];
            if (!$user = $this->Users->createSocialAccount($provider, $providerInfo)) {
                ResultMessage::setMessage('Sorry but we cannot create your account right now.', false);
                return;
            }
//            $userArray = $user->toArray();
//            $userArray['access_token'] = $accessToken;
            $this->setUserResponse($user, true);
            ResultMessage::setSuccess(true);
        } catch (\Facebook\Exceptions\FacebookSDKException $ex) {
            ResultMessage::setMessage('FacebookSDKException');
        } catch (\Facebook\Exceptions\FacebookAuthorizationException $ex) {
            ResultMessage::setMessage('FacebookAuthorizationException');
        } catch (\Facebook\Exceptions\FacebookAuthenticationException $ex) {
            ResultMessage::setMessage('FacebookAuthenticationException');
        }
    }

    private function setUserResponse($user, $auth = false) {
        if (!is_array($user)) {
            $user = [
                'id' => $user->id,
                'email' => $user->email,
                'username' => $user->username,
                'created' => $user->created
            ];
        } else {
            $user = [
                'id' => $user['id'],
                'email' => $user['email'],
                'username' => $user['username'],
                'created' => $user['created'],
            ];
        }
        if ($auth) {
            $this->Auth->setUser($user);
        }
        ResultMessage::setData('user', $user);

        $this->setToken();
    }

    public function logout() {
        if ($this->request->is('post')) {
            $this->Auth->logout();
            ResultMessage::setMessage('You are now logged out.', true);
        }
    }

    public function remove_account() {

        ResultMessage::setWrapper(true);
        ResultMessage::setMessage("Wrong password", false);
        if ($this->request->is('post') && !empty($this->request->data['password'])) {
            try {
                $this->Users->getUserWithPassword($this->Auth->user('id'), $this->request->data['password']);
            } catch (\Cake\Datasource\Exception\RecordNotFoundException $ex) {
                return;
            }

            $success = $this->Users->deleteAll([
                'Users.id' => $this->Auth->user('id'),
            ]);
            if ($success) {
                ResultMessage::setMessage("Your account has been deleted. We hope to see you back soon!", true);
                $this->Auth->logout();
            }
        }
    }

    /**
     * Add method
     *
     * @return void Redirects on successful add, renders view otherwise.
     */
    public function signup() {
        ResultMessage::setMessage("Please correct the form and try again.", false);
        $user = $this->Users->newEntity();
        if ($this->request->is('post')) {
            if ($this->Recaptcha->verify()) {
                $user = $this->Users->patchEntity($user, $this->request->data);
                $this->status = \App\Model\Entity\User::STATUS_ACTIVATED;
                $user->password = $this->Users->hashPassword($user->password);
                if ($this->Users->save($user)) {
                    $this->setUserResponse($user, true);
                    assert($this->Auth->user('id'));
                    ResultMessage::setMessage('Welcome!', true);
                } else {
                    ResultMessage::setMessage('Your account cannot be created. Please check your inputs.', false);
                    ResultMessage::addValidationErrorsModel($user);
                }
            } else {
                ResultMessage::setMessage('Are you a robot ? ', false);
            }
        }
    }

    /**
     * 
     */
    public function request_password() {
        try {
            $entity = $this->Users->newEntity(null, ['validate' => 'requestPassword']);
            if ($this->request->is('post')) {
                $entity = $this->Users->patchEntity($entity, $this->request->data, ['validate' => 'requestPassword']);

                if (!$entity->errors('email')) {
                    if ($this->Users->initPasswordReset($entity->email)) {
                        ResultMessage::setMessage("Email has been sent to you with the instructions to reset your password.", true);
                    } else {
                        ResultMessage::setMessage("We cannot reset your password for now. Please try again later.", false);
                    }
                } else {
                    ResultMessage::setMessage("This email is invalid", false);
                    ResultMessage::addValidationErrorsModel($entity);
                }
            }
        } catch (\Cake\Datasource\Exception\RecordNotFoundException $ex) {
            ResultMessage::setMessage("Email has been sent to you with the instructions to reset your password.", true);
            if (\Cake\Core\Configure::read('debug')){
                ResultMessage::appendMessage(' Email does not exists in db');
            }
        } catch (\Exception $ex) {
            ResultMessage::setMessage("Sorry but, we cannot send you an email right now. Please try again later", false);
            if (\Cake\Core\Configure::read('debug')) {
                throw $ex;
            }
        }
    }

    public function reset_password($token = null) {
        if (!$this->request->is('post')) {
            return;
        }
        try {
            $token = \App\Lib\DataUtil::getString($this->request->data, 'token', null);
            $entity = $this->Users->verifyPasswordResetToken($token);
        } catch (\Cake\Datasource\Exception\RecordNotFoundException $e) {

            ResultMessage::setMessage('Sorry but this token is invalid. Open the link sent to you by email.', false);
            return;
        }

        if (isset($entity->token_is_expired) && $entity->token_is_expired === true) {
            ResultMessage::setMessage('Sorry but this token is expired. You must ask to reset your password again', false);
            return;
        }

        $this->_change_password($entity);
    }

    public function change_password() {
        if ($this->request->is('post')) {
            try {
//                $oldPassword = \App\Lib\DataUtil::getString($this->request->data, 'old_password');
//                $newPassword = \App\Lib\DataUtil::getString($this->request->data, 'password');
//                $entity = $this->Users->getUserWithPassword($this->Auth->user('id'), $oldPassword);
//                $entity->password = $this->Users->hashPassword($newPassword);
//                $this->_change_password($entity);

                $oldPassword = \App\Lib\DataUtil::getString($this->request->data, 'old_password');
                $entity = $this->Users->getUserWithPassword($this->Auth->user('id'), $oldPassword);
                $entity = $this->Users->patchEntity($entity, $this->request->data);
//                debug($entity);
                $this->_change_password($entity);
            } catch (\Cake\Datasource\Exception\RecordNotFoundException $ex) {
                ResultMessage::addValidationError('Users', 'old_password', 'invalid', 'Invalid password');
                ResultMessage::setMessage('Invalid password', false);
                return;
            }
        }
    }

    private function _change_password($entity) {
        if ($this->Users->resetPassword($entity)) {
            ResultMessage::setMessage('Your new password has been saved!', true);
        } else {
            ResultMessage::setMessage('Choose a valid password.', false);
            ResultMessage::addValidationErrorsModel($entity);
        }
    }

    /**
     * If the user can access, it means that he has the right token
     */
    public function check_token() {
        ResultMessage::setSuccess();
    }

    /* ========================================================================
     * OTHERS
     */

    // For JSON LOGIN
    protected function setToken($userId = null) {
        if ($userId === null) {
            $userId = $this->Auth->user('id');
        }
        $token = \Firebase\JWT\JWT::encode([
                    'id' => $userId,
                    'sub' => $userId,
                    'exp' => time() + \Cake\Core\Configure::read('TokenExpirationTime'),
                    'iat' => time()
                        ], Security::salt());

//        ResultMessage::setData('id', $userId);
//        ResultMessage::setData('username', $this->Auth->user('username'));
//        ResultMessage::setData('email', $this->Auth->user('email'));
//        ResultMessage::setData('created', $this->Auth->user('created'));
        ResultMessage::setToken($token);
    }

    /**
     * Add method
     *
     * @return void Redirects on successful add, renders view otherwise.
     */
//    public function add() {
//        $user = $this->Users->newEntity();
//        if ($this->request->is('post')) {
//            $user = $this->Users->patchEntity($user, $this->request->data);
//            if ($this->Users->save($user)) {
//                ResultMessage::setMessage('The user has been saved.', true);
//                $this->setToken($user['id']);
//                ResultMessage::setRedirectUrl(['action' => 'index']);
//            } else {
//                ResultMessage::setMessage('The user could not be saved. Please, try again.', false);
//                ResultMessage::addValidationErrorsModel($user);
//            }
//        }
//        ResultMessage::setData('user', $user);
//    }

    /**
     * Edit method
     *
     * @param string|null $id User id.
     * @return void Redirects on successful edit, renders view otherwise.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
//    public function edit() {
//        if (!$this->request->is('post')) {
//            return;
//        }
//        $id = $this->Auth->user('id');
//        $data = $this->request->data;
//        $data['id'] = $id;
//        $user = new \App\Model\Entity\User($data);
//        if ($this->Users->save($user)) {
//            ResultMessage::setMessage(__('The user has been saved.'), true);
//        } else {
//            ResultMessage::setMessage(__('The user could not be saved. Please, try again.'));
//            ResultMessage::setValidationErrors($user->errors());
//        }
//    }
//    public function social_login() {
//        if (!empty($this->request->is('post')) && !empty($this->request->data['provider'])) {
//            $provider = $this->request->data['provider'];
//
//            try {
//                // initialize Hybrid_Auth class with the config file
//                $hybridauth = new \Hybrid_Auth(\Cake\Core\Configure::read('HybridAuth'));
//
//                // try to authenticate with the selected provider
//                $adapter = $hybridauth->authenticate($provider);
//
//                // then grab the user profile
//                $user_profile = $adapter->getUserProfile();
//                ResultMessage::overwriteData($user_profile);
//                $this->Auth->setUser($user_profile);
//                ResultMessage::setMessage('Your are now log in with ' . $provider, true);
//            }
//            // something went wrong?
//            catch (Exception $e) {
//                ResultMessage::setMessage('We cannot log you in with ' . $provider, false);
//            }
//        } else {
//            ResultMessage::setMessage("Unknown provider. Please try again", false);
//        }
//    }
}
