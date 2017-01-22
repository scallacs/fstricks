<?php

/**
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link      http://cakephp.org CakePHP(tm) Project
 * @since     0.2.9
 * @license   http://www.opensource.org/licenses/mit-license.php MIT License
 */

namespace App\Controller;

use Cake\Controller\Controller;
use App\Lib\ResultMessage;
use Cake\Core\Configure;

/**
 * Application Controller
 *
 * Add your application-wide methods in the class below, your controllers
 * will inherit them.
 *
 * @link http://book.cakephp.org/3.0/en/controllers.html#the-app-controller
 */
class AppController extends Controller {

    public $helpers = [
        'Form' => [
            'className' => 'Bootstrap.BootstrapForm' // instead of 'Bootstrap3.BootstrapForm'
        ]
    ];

    /**
     * Initialization hook method.
     *
     * Use this method to add common initialization code like loading components.
     *
     * @return void
     */
    public function initialize() {
        parent::initialize();
        $this->loadComponent('Auth', [
            'authenticate' => [
                'Form' => [
                    'fields' => [
                        'username' => 'email',
                        'password' => 'password'
                    ]
                ],
                'ADmad/JwtAuth.Jwt' => [
                    'parameter' => '_token',
                    'userModel' => 'Users',
                    //'scope' => ['Users.active' => 1],
                    'fields' => [
                        'id' => 'id'
                    ]
                ],
            ],
            'loginAction' => [
                'controller' => 'Users',
                'action' => 'login'
            ],
            'authorize' => 'Controller'
        ]);
        
        $this->loadComponent('Search.Prg', [
            'actions' => ['index']
        ]);
    }

    public function isAuthorized($user) {
        return true;
    }

    public $components = [
        'RequestHandler',
            /*        'Crud.Crud' => [
              'actions' => [
              'Crud.Index',
              'Crud.View',
              'Crud.Add',
              'Crud.Edit',
              'Crud.Delete'
              ],
              'listeners' => [
              'Crud.Api',
              'Crud.ApiPagination',
              'Crud.ApiQueryLog'
              ]
              ] */
    ];

    public function beforeFilter(\Cake\Event\Event $event) {
        parent::beforeFilter($event);
//        debug(Configure::read('Headers'));
        $this->response->header('Access-Control-Allow-Origin', Configure::read('Headers.Access-Control-Allow-Origin'));

//        if (Configure::read('onlyLoggedUser') && !$this->Auth->user('id')){
//            throw new \Cake\Network\Exception\UnauthorizedException();
////            return $this->redirect(['controller' => 'Users', 'action' => 'beta_login', 'prefix' => null]);
//        }
    }

    /**
     *  Render the json_encode data
     * @param array $data 
     */
    public function beforeRender(\Cake\Event\Event $event) {
        $this->set('isUserConnected', $this->Auth->user('id') != null);
        $this->set('currentUser', $this->Auth->user('id') != null ? ['User' => $this->Auth->user()] : null);

        if ($this->request->is('json')) {
            $this->set('data', ResultMessage::render());
            $this->set('_serialize', 'data');
            $this->response->type('json');
        } else {
//            if (ResultMessage::hasMessage()) {
//                $this->Flash->set(ResultMessage::$message);
//            }
//
//            if (ResultMessage::$redirectUrl === null) {
//                $this->redirect($this->referer());
//            } else if (ResultMessage::$redirectUrl !== false) {
//                $this->redirect(ResultMessage::getRedirectUrl());
//            } else {
                foreach (ResultMessage::$data as $d => $v) {
                    $this->set($d, $v);
                }
//            }
            // No redirection $data['redirectUrl'] === false
        }
        return parent::beforeRender($event);
    }

}
