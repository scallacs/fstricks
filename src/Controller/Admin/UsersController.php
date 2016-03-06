<?php

namespace App\Controller\Admin;
use App\Lib\ResultMessage;
use Cake\Utility\Security;

/**
 * Users Controller
 *
 * @property \App\Model\Table\UsersTable $Users
 */
class UsersController extends AppController {

    public function beforeFilter(\Cake\Event\Event $event) {
        parent::beforeFilter($event);
//        $this->Auth->allow();
    }

    /* ========================================================================
     * VIEWS
     */

    /**
     *
     * @return void
     */
    public function login () {
        $this->viewBuilder()->layout('blank');
        if ($this->request->is('post')){
            $username = \App\Lib\DataUtil::getString($this->request->data, 'username');
            $password = \App\Lib\DataUtil::getString($this->request->data, 'password');
            
            if ($username === 'scallacsadmin' && $password === 'r4xc3oSFSTADMIN'){
                $this->Auth->setUser([
                    'role' => 'admin',
                    'id' => null,
                ]);
                $this->redirect(['controller' => 'Pages', 'action' => 'app']);
            }
        }
    }
}