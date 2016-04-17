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
        $this->Tags->initFilters('admin');
        $query = $this->Tags
                ->find('search', $this->Tags->filterParams($this->request->query))
                ->contain([
                    'Categories' => ['Sports']
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

    public function updateSlug($id = null) {
        $entity = $this->Tags->updateSlug($id);
        if (empty($entity->errors())) {
            ResultMessage::setMessage("Slug updated!", true);
            ResultMessage::setData('slug', $entity->slug);
        } else {
            ResultMessage::setMessage("Cannot update slug", false);
//            ResultMessage::addValidationErrorsModel($entity)
        }
    }

    /**
     * @queryType POST
     */
    public function edit($id = null) {
        $this->request->allowMethod(['post', 'put', 'patch']);
        ResultMessage::setWrapper(true);
        $tag = $this->Tags->get($id);
        $tag = $this->Tags->patchEntity($tag, $this->request->data, [
            'fieldList' => ['status', 'name', 'slug', 'category_id'],
            'guard' => false
        ]);
        if ($this->Tags->save($tag)) {
            ResultMessage::setMessage(__('The tag has been saved.'), true);
        } else {
            ResultMessage::setMessage(__('The tag could not be saved. Please, try again.'), false);
            ResultMessage::addValidationErrorsModel($tag);
        }
    }

}
