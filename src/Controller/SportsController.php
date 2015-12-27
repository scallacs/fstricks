<?php
namespace App\Controller;

use App\Controller\AppController;

/**
 * Sports Controller
 *
 * @property \App\Model\Table\SportsTable $Sports
 */
class SportsController extends AppController
{

    public function beforeFilter(\Cake\Event\Event $event) {
        parent::beforeFilter($event);
        $this->Auth->allow(['index']);
    }
    /**
     * Index method
     *
     * @return void
     */
    public function index(){
        $data = $this->Sports->find('all')
                ->contain(['Categories']);
        \App\Lib\ResultMessage::overwriteData($data->all());
        \App\Lib\ResultMessage::setWrapper(false);
    }

}
