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
        $this->loadComponent('Flash');

        $this->loadComponent('Auth', [
            'authenticate' => [
                'ADmad/HybridAuth.HybridAuth',
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
            ]
        ]);


        $this->Auth->allow(['display', 'login']);
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
    }

    /**
     *  Render the json_encode data
     * @param array $data 
     */
    public function beforeRender(\Cake\Event\Event $event) {
        $this->set('isUserConnected', $this->Auth->user('id') != null);
        $this->set('currentUser', $this->Auth->user('id') != null ? ['User' => $this->Auth->user()] : null);

        if (//$this->Rest->isActive() || 
                $this->request->is('json')) {
            if (ResultMessage::hasWrapper()) {
                $serialize = ['message', 'data', 'success', 'returnCode', 'details', 'validationErrors', 'debug', 'token'];

                $this->set('message', ResultMessage::$message);
                $this->set('data', ResultMessage::$data);
                $this->set('success', ResultMessage::$success);
                $this->set('returnCode', ResultMessage::$returnCode);
                $this->set('validationErrors', ResultMessage::$validationErrors);
                $this->set('details', ResultMessage::$details);
                $this->set('debug', array(
                    'request' => $this->request
                ));
                if (ResultMessage::$token) {
                    $this->set('token', ResultMessage::$token);
                }

                if (isset($this->request->params['paging'])) {
                    $this->set('paginate', current($this->request->params['paging']));
                    $serialize[] = 'paginate';
                }

                $this->set('_serialize', $serialize);
            } else {
                $this->set('data', ResultMessage::$data);
                $this->set('_serialize', 'data');
            }
            $this->response->type('json');
        } else {
            if (ResultMessage::$message !== null) {
                $this->Flash->set(ResultMessage::$message);
            }

            if (ResultMessage::$redirectUrl === null) {
                $this->redirect($this->referer());
            } else if (ResultMessage::$redirectUrl !== false) {
                $this->redirect(ResultMessage::getRedirectUrl());
            } else {
                foreach (ResultMessage::$data as $d => $v) {
                    $this->set($d, $v);
                }
            }
            // No redirection $data['redirectUrl'] === false
        }
        return parent::beforeRender($event);
    }

}
