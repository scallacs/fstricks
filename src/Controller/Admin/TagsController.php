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
        ResultMessage::paginate($query, $this);
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
    
    public function updateSlug($id = null){
        $entity = $this->Tags->updateSlug($id);
        if (empty($entity->errors())){
            ResultMessage::setMessage("Slug updated!", true);
            ResultMessage::setData('slug', $entity->slug);
        }
        else{
            ResultMessage::setMessage("Cannot update slug", false);
//            ResultMessage::addValidationErrorsModel($entity)
        }
    }
}
