<?php

namespace App\Controller\Admin;
use App\Lib\ResultMessage;

/**
 * Tags Controller
 *
 * @property \App\Model\Table\TagsTable $Tags
 */
class TagsController extends AppController {

    public function beforeFilter(\Cake\Event\Event $event) {
        parent::beforeFilter($event);
    }
    
    public function index() {
        $query = $this->Tags->find('all')
                ->contain([
                    'Categories', 
                    'Sports'
                ]);
        ResultMessage::setWrapper(false);
        ResultMessage::overwriteData($this->paginate($query));
//        ResultMessage::setPaginateData(
//                $this->paginate($query), 
//                $this->request->params['paging']['Users']);
    }
    
    /**
     * View method
     *
     * @param string|null $id Video Tag id.
     * @return void
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function view($id = null) {
        $tag = $this->Tags->get($id);
        ResultMessage::overwriteData($tag);
        ResultMessage::setWrapper(false);
    }
}
