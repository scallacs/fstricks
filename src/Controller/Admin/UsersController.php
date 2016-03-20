<?php

namespace App\Controller\Admin;

use App\Lib\ResultMessage;
use Cake\Core\Configure;
use Cake\Utility\Security;

/**
 * Users Controller
 *
 * @property \App\Model\Table\UsersTable $Users
 */
class UsersController extends AppController {

    public function initialize() {
        parent::initialize();
        $this->loadComponent('Paginator');
    }

    public function beforeFilter(\Cake\Event\Event $event) {
        parent::beforeFilter($event);
        $this->Auth->allow(['login']);
    }
    

    /* ========================================================================
     * VIEWS
     */

    public function index() {
        $this->Paginator->config(Configure::read('Pagination.Users'));
        ResultMessage::setWrapper(false);
        try {
            $query = $this->Users->find('all');
            ResultMessage::setPaginateData(
                    $this->paginate($query), 
                    $this->request->params['paging']['Users']);
        } catch (NotFoundException $e) {
            ResultMessage::overwriteData([]);
        }
    }
    

    public function search() {
        ResultMessage::setWrapper(false);
        $q = \App\Lib\DataUtil::getString($this->request->query, 'q');
        if (strlen($q) >= 2) {
            $data = $this->Users
                    ->search($q)
                    ->all();
            ResultMessage::overwriteData($data);
        }
    }
    

    /**
     *
     * @return void
     */
    public function login() {
        $this->viewBuilder()->layout('blank');
        if ($this->request->is('post')) {
            $username = \App\Lib\DataUtil::getString($this->request->data, 'username');
            $password = \App\Lib\DataUtil::getString($this->request->data, 'password');

            if ($username === 'scallacsadmin' && $password === 'r4xc3oSFSTADMIN') {
                $this->Auth->setUser([
                    'role' => 'admin',
                    'username' => 'ADMIN',
                    'id' => null,
                ]);
                $this->redirect(['controller' => 'Pages', 'action' => 'app']);
            }
        }
    }

    
    /**
     * View method
     *
     * @param string|null $id Video Tag id.
     * @return void
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function view($id = null) {
        $videoTag = $this->Users->get($id);
        ResultMessage::overwriteData($videoTag);
        ResultMessage::setWrapper(false);
    }
}
