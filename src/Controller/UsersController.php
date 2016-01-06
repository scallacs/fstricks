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
    public function history(){
        
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
    
    public function profile($id = null){
        if ($id === null){
            $id = $this->Auth->user('username');
        }
        
        if (!$this->request->is('json')){
            $this->set('profileId', $id);
        }
        else{            
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
        ResultMessage::setData('username', $this->Auth->user('email'));
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
        if (!$this->request->is('post')){
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
    public function check_token(){
        ResultMessage::setSuccess();
    }
    
    
}
