<?php
namespace App\Controller;

use App\Controller\AppController;
use App\Lib\ResultMessage;
/**
 * Sports Controller
 *
 * @property \App\Model\Table\SportsTable $Sports
 */
class SportsController extends AppController
{

    public function beforeFilter(\Cake\Event\Event $event) {
        parent::beforeFilter($event);
        $this->Auth->allow(['index', 'view']);
    }
    /**
     * Index method
     *
     * @return void
     */
    public function index(){
        $data = $this->Sports->findAllCached();
        ResultMessage::overwriteData($data->all());
        ResultMessage::setWrapper(false);
    }
    
    
}
