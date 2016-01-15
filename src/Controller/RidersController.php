<?php

namespace App\Controller;

use App\Controller\AppController;

use App\Lib\ResultMessage;

/**
 * Riders Controller
 *
 * @property \App\Model\Table\RidersTable $Riders
 */
class RidersController extends AppController {

    public function beforeFilter(\Cake\Event\Event $event) {
        parent::beforeFilter($event);
        $this->Auth->allow(['view', 'search']);
    }

    /**
     * Search rider thanks to Facebook API
     * @return type
     */
    public function search() {
        ResultMessage::setWrapper(false);
        
        // If not log in with facebook
        if (!$this->Auth->user('access_token')) {
            return;
        }
        $q = !empty($this->request->query['q']) ? $this->request->query['q'] : '';
        if (strlen($q) <= 2){
            return;
        }
        $facebookRequest = new \App\Lib\FacebookRequest([
            'key' => \Cake\Core\Configure::read('Facebook.key'),
            'id' => \Cake\Core\Configure::read('Facebook.id'),
            'token' => $this->Auth->user('access_token')->getValue()
        ]);

        $data = $facebookRequest->searchPeople($q);
        if ($data) {
            ResultMessage::overwriteData($data);
        }
    }

}
