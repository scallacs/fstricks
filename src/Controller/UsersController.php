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

    public function beforeFilter(\Cake\Event\Event $event) {
        $this->Auth->allow(['add', 'token', 'profile', 'login', 'signup', 'username_exists']);
    }

    /* ========================================================================
     * VIEWS
     */

    /**
     * Index method
     *
     * @return void
     */
    public function index() {
        $this->set('users', $this->paginate($this->Users));
        $this->set('_serialize', ['users']);
    }

    // ??
    public function history() {
        
    }

    /**
     * View method
     *
     * @param string|null $id User id.
     * @return void
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function view($id = null) {
        $user = $this->Users->get($id, [
            'contain' => ['Spots']
        ]);
        $this->set('user', $user);
        $this->set('_serialize', ['user']);
    }

    /* ========================================================================
     * API
     */

    /**
     * Save user tags
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

    /* ========================================================================
     * OTHERS
     */

    // For JSON LOGIN
    protected function setToken($userId = null) {
        if ($userId === null) {
            $userId = $this->Auth->user('id');
        }
        ResultMessage::setData('id', $userId);
        ResultMessage::setData('username', $this->Auth->user('username'));
        ResultMessage::setData('email', $this->Auth->user('email'));
        ResultMessage::setData('created', $this->Auth->user('created'));
        ResultMessage::setData('token', \Firebase\JWT\JWT::encode([
                    'id' => $userId,
                    'sub' => $userId,
                    'exp' => time() + 604800,
                    'iat' => time()
                        ], Security::salt())
        );
    }

    /**
     * Add method
     *
     * @return void Redirects on successful add, renders view otherwise.
     */
    public function add() {
        $user = $this->Users->newEntity();
        if ($this->request->is('post')) {
            $user = $this->Users->patchEntity($user, $this->request->data);
            if ($this->Users->save($user)) {
                ResultMessage::setMessage('The user has been saved.', true);
                $this->setToken($user['id']);
                ResultMessage::setRedirectUrl(['action' => 'index']);
            } else {
                ResultMessage::setMessage('The user could not be saved. Please, try again.', false);
                ResultMessage::addValidationErrorsModel($user);
            }
        }
        ResultMessage::setData('user', $user);
    }

    /**
     * Edit method
     *
     * @param string|null $id User id.
     * @return void Redirects on successful edit, renders view otherwise.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function edit() {
        if (!$this->request->is('post')) {
            return;
        }
        $id = $this->Auth->user('id');
        $data = $this->request->data;
        $data['id'] = $id;
        $user = new \App\Model\Entity\User($data);
        if ($this->Users->save($user)) {
            ResultMessage::setMessage(__('The user has been saved.'), true);
        } else {
            ResultMessage::setMessage(__('The user could not be saved. Please, try again.'));
            ResultMessage::setValidationErrors($user->errors());
        }
    }

    public function login() {
        if ($this->request->is('post')) {
            $user = $this->Auth->identify();
            if ($user) {
                // Create social profile
                if (!empty($provider) && !empty($user['identifier'])) {
                    if (!$user = $this->Users->createSocialAccount($provider, $user)) {
                        ResultMessage::setMessage('We cannot log you in with ' . $provider, false);
                        return;
                    }
                }
                $this->Auth->setUser($user);
                $this->setToken();
                ResultMessage::setRedirectUrl($this->Auth->redirectUrl());
                ResultMessage::setMessage("Welcome back !", true);
            } else {
                ResultMessage::setMessage('Your username or password is incorrect', false);
            }
            return;
        }
        if ($this->request->is('ajax')) {
            ResultMessage::setMessage('Cannot get your data.', false);
        }
    }
    
    public function username_exists($username){
        $exists = $this->Users->exists(['Users.username' => $username]);
        ResultMessage::setWrapper(false);
        ResultMessage::setData('exists', $exists);
    }
/*
    public function social_login() {

        if (!empty($this->request->is('post')) && !empty($this->request->data['provider'])) {

            try {
                $provider = $this->request->data['provider'];
                // initialize Hybrid_Auth class with the config file
                $hybridauth = new \Hybrid_Auth(\Cake\Core\Configure::read('HybridAuth'));

                // try to authenticate with the selected provider
                $adapter = $hybridauth->authenticate($provider);

                // then grab the user profile
                $user_profile = $adapter->getUserProfile();
            }
            // something went wrong?
            catch (Exception $e) {
                header("Location: http://www.example.com/login-error.php");
            }
        }
    }
 * 
 */

    /*
      public function login_facebook() {
      session_start();
      $state = uniqid();
      $persistantDataHandler = new \Facebook\PersistentData\FacebookSessionPersistentDataHandler();
      $fb = new \Facebook\Facebook([
      'app_id' => \Cake\Core\Configure::read('Facebook.id'),
      'app_secret' => \Cake\Core\Configure::read('Facebook.key'),
      'default_graph_version' => 'v2.2',
      //'default_access_token' => \Cake\Core\Configure::read('Facebook.id').'|'.\Cake\Core\Configure::read('Facebook.key')
      ], $persistantDataHandler->set('state', $state));

      //        debug($this->request->query);
      //        debug($this->request->data);


      $_GET = $this->request->data;
      $_GET['state'] = $state;
      //debug($_GET);die();

      $helper = $fb->getRedirectLoginHelper();
      try {
      $accessToken = $helper->getAccessToken();
      } catch (Facebook\Exceptions\FacebookResponseException $e) {
      // When Graph returns an error
      ResultMessage::setMessage('Graph returned an error: ' . $e->getMessage(), false);
      return;
      } catch (Facebook\Exceptions\FacebookSDKException $e) {
      // When validation fails or other local issues
      ResultMessage::setMessage('Facebook SDK returned an error: ' . $e->getMessage(), false);
      return;
      }
      debug('okkkkk"');
      die();
      if (isset($accessToken)) {
      // Logged in!
      $token = (string) $accessToken;

      // Check if user has already an account
      $socialAccounts = \Cake\ORM\TableRegistry::get('SocialAccounts');
      $user = $socialAccounts->find()
      ->contain(['Users'])
      ->where(['social_provider_id' => 'facebook', 'profile_id' => $profile['id']]);

      if ($user->first()) {
      // Identify
      $this->Auth->login($user['User']['id']);
      $this->setToken();
      return;
      }

      // Create new user
      $user = $this->Users->newEntity();
      $user->username = $profile['first_name'] . ' ' . $profile['last_name'];
      $user->email = $profile['email'];

      if (!$this->Users->save($user)) {
      ResultMessage::setMessage('Cannot create user', false);
      return;
      }

      $this->Auth->login($user['User']['id']);
      $this->setToken();
      // Now you can redirect to another page and use the
      // access token from $_SESSION['facebook_access_token']
      ResultMessage::setMessage("You are log in with facebook", true);
      } else {
      debug($helper);
      die();
      ResultMessage::setMessage('Facebook login is not available for now. Please try again later.', false);
      }
      }

    public function login_facebook() {
        $client = new \Cake\Network\Http\Client();
        $params = [
            'client_id' => \Cake\Core\Configure::read('Facebook.id'),
            'redirect_uri' => $this->request->data['redirectUri'],
            'client_secret' => \Cake\Core\Configure::read('Facebook.key'),
            'grant_type' => 'client_credentials',
            'code' => $this->request->data['code'],
        ];
        // Step 1. Exchange authorization code for access token.
        $accessToken = $client->get('https://graph.facebook.com/v2.5/oauth/access_token', $params);
        if (!$accessToken->isOk()) {
            ResultMessage::setMessage('Facebook login is not available for now. Please try again later.', false);
            ResultMessage::addTrace($accessToken->statusCode());
            return;
        }
        $accessTokenData = json_decode($accessToken->body());

        // Step 2. Retrieve profile information about the current user.
        //$client = new \Cake\Network\Http\Client(['headers' => ['Authorization' => 'bearer ' . $accessTokenData->access_token]]);
        $profile = $client->get('https://graph.facebook.com/v2.5/me', [
            'access_token' => $accessTokenData->access_token
        ]);
        debug($accessTokenData);
        debug($profile);
        die();

        // Step 3a. If user is already signed in then link accounts.
        if ($this->Auth->user('id')) {
            $socialAccounts = \Cake\ORM\TableRegistry::get('SocialAccounts');
            $user = $socialAccounts->find()
                    ->where([
                'SocialAccounts.social_provider_id' => 'facebook',
                'SocialAccounts.social_id' => $profile['id']
            ]);
            if ($user->first()) {
                ResultMessage::setMessage('There is already a Facebook account that belongs to you', false);
                return;
            }
            $socialAccount = $socialAccounts->newEntity();
            $socialAccount->user_id = $this->Auth->user('id');
            $socialAccount->social_provider_id = 'facebook';
            $socialAccount->social_id = $profile['id'];
        }
        // Step 3b. Create a new user account or return an existing one.
        else {
            $user = $this->Users->find()
                    ->where([
                'email' => $profile['email']
            ]);

            if ($user->first()) {
                // Identify
                $this->Auth->login($user['User']['id']);
                $this->setToken();
                return;
            }

            // Create new user
            $user = $this->Users->newEntity();
            $user->username = $profile['first_name'] . ' ' . $profile['last_name'];
            $user->email = $profile['email'];
            if (!$this->Users->save($user)) {
                ResultMessage::setMessage('Cannot create user', false);
                return;
            }
            ResultMessage::setMessage('You are logged in with facebook', true);
        }
    }
     */

    public function logout() {
        ResultMessage::setMessage('You are now logged out.', true);
        $this->Auth->logout();
        return;
    }

    public function remove_account() {

        ResultMessage::setWrapper(true);
        ResultMessage::setMessage("Wrong password", false);
        if ($this->request->is('post') && !empty($this->request->data['password'])) {
            $query = $this->Users->find()
                    ->select(['Users.password'])
                    ->where([
                        'id' => $this->Auth->user('id'),
                        'provider_uid IS NULL'
                    ]);
            $data = $query->first();
            
            if (empty($data) || !\App\Model\Entity\User::checkPassword($this->request->data['password'], $data->password)){
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
            $user = $this->Users->patchEntity($user, $this->request->data);
            if ($this->Users->save($user)) {      
                $userArray = [
                    'id' => $user->id,
                    'email' => $user->email,
                    'username' => $user->username,
                    'created' => $user->created
                ];
                $this->Auth->setUser($userArray);
                $this->setToken();
                assert($this->Auth->user('id'));
                ResultMessage::setMessage('The user has been saved.', true);
                ResultMessage::setRedirectUrl(['action' => 'index']);
                ResultMessage::setData('user', $userArray);
            } else {
                ResultMessage::setMessage('Your account cannot be created. Please check your inputs.', false);
                ResultMessage::addValidationErrorsModel($user);
            }
        }
    }

    /**
     * If the user can access, it means that he has the right token
     */
    public function check_token() {
        ResultMessage::setSuccess();
    }

}
