<?php

namespace App\Controller;

use App\Controller\AppController;
use App\Lib\ResultMessage;
use Cake\Utility\Security;
use Cake\Network\Http\Client;

/**
 * Users Controller
 *
 * @property \App\Model\Table\UsersTable $Users
 */
class UsersController extends AppController {

    public function beforeFilter(\Cake\Event\Event $event) {
        $this->Auth->allow(['add', 'token', 'profile']);
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
                    ->where(['Users.username' => $id])
                    ->contain(['Spots' => function($q) {
            return $q->limit(1)
                    ->where(['Spots.anonymous' => 0])
                    ->contain(['Tags'])
                    ->order(['Spots.created DESC']);
        }]);
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
    public function signup() {
        ResultMessage::setMessage("Please send back the form", false);
        $user = $this->Users->newEntity();
        if ($this->request->is('post')) {
            $user = $this->Users->patchEntity($user, $this->request->data);
            if ($this->Users->save($user)) {
                ResultMessage::setMessage('The user has been saved.', true);
                $this->setToken($user['id']);
                ResultMessage::setRedirectUrl(['action' => 'index']);
                ResultMessage::setData('user', $user);
            } else {
                ResultMessage::setMessage('Your account cannot be created. Please check your inputs.', false);
                ResultMessage::addValidationErrorsModel($user);
            }
        }
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

    /**
     * Delete method
     *
     * @param string|null $id User id.
     * @return void Redirects to index.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function delete($id = null) {
        $this->request->allowMethod(['post', 'delete']);
        $user = $this->Users->get($id);
        if ($this->Users->delete($user)) {
            $this->Flash->success(__('The user has been deleted.'));
        } else {
            $this->Flash->error(__('The user could not be deleted. Please, try again.'));
        }
        return $this->redirect(['action' => 'index']);
    }

    public function login() {
        if ($this->request->is('post')) {
            $user = $this->Auth->identify();
            if ($user) {
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

    public function logout() {
        ResultMessage::setMessage('You are now logged out.', true);
        return $this->redirect($this->Auth->logout());
    }

    /**
     * If the user can access, it means that he has the right token
     */
    public function check_token() {
        ResultMessage::setSuccess();
    }

}




    /**
     * TODO
     * Login with Facebook.
    public function facebook() {
        $client = new Client();
        $data = $this->request->data;
        $params = [
            'code' => $data['code'],
            'client_id' => $data['clientId'],
            'redirect_uri' => $data['redirectUri'],
            'client_secret' => Configure::read('Facebook.key')
        ];
        // Step 1. Exchange authorization code for access token.
        $accessTokenResponse = $client->get('https://graph.facebook.com/v2.5/oauth/access_token', [
            'q' => $params
        ]);
        $accessToken = json_decode($accessTokenResponse->getBody(), true);
        // Step 2. Retrieve profile information about the current user.
        $profileResponse = $client->get('https://graph.facebook.com/v2.5/me', [
            'q' => $accessToken
        ]);
        $profile = json_decode($profileResponse->getBody(), true);
        // Step 3a. If user is already signed in then link accounts.
        if ($request->header('Authorization')) {
            $socialsAccounts = \Cake\ORM\TableRegistry::get('SocialAccounts');
            $user = $socialsAccounts->find('all')
                    ->where([
                        'SocialAccounts.provider_id', 'facebook', 
                        'SocialAccounts.id' => $profile['id']]);
            
            if ($user->first()) {
                ResultMessage::setMessage('There is already a Facebook account that belongs to you', false);
                return;
            }
            $token = explode(' ', $request->header('Authorization'))[1];
            // TODO 
            $payload = (array) \Firebase\JWT\JWT::decode($token, Config::get('app.token_secret'), array('HS256'));
            $user = User::find($payload['sub']);
            $user->facebook = $profile['id'];
            $user->displayName = $user->displayName ? : $profile['name'];
            $user->save();
            return response()->json(['token' => $this->createToken($user)]);
        }
        // Step 3b. Create a new user account or return an existing one.
        else {
            $user = User::where('facebook', '=', $profile['id']);
            if ($user->first()) {
                return response()->json(['token' => $this->createToken($user->first())]);
            }
            $user = new User;
            $user->facebook = $profile['id'];
            $user->displayName = $profile['name'];
            $user->save();
            return response()->json(['token' => $this->createToken($user)]);
        }
    }
     */