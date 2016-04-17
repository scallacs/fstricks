<?php
namespace App\Controller\Admin;
use App\Lib\ResultMessage;

/**
 * Categories Controller
 *
 * @property \App\Model\Table\CategoriesTable $Categories
 */
class CategoriesController extends AppController
{

    /**
     * Index method
     *
     * @return void
     */
    public function index()
    {
        $query = $this->Categories->find('all');
        ResultMessage::paginate($query, $this);
    }

    /**
     * View method
     *
     * @param string|null $id Category id.
     * @return void
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function view($id = null)
    {
        $category = $this->Categories->get($id, [
            'contain' => ['Sports', 'Tags']
        ]);
        ResultMessage::setWrapper(false);
        ResultMessage::overwriteData($category);
    }

    /**
     * Add method
     *
     * @return void Redirects on successful add, renders view otherwise.
     */
    public function add()
    {
        $category = $this->Categories->newEntity();
        if ($this->request->is('post')) {
            $category = $this->Categories->patchEntity($category, $this->request->data);
            if ($this->Categories->save($category)) {
                ResultMessage::setMessage(__('The category has been saved.'), true);
            } else {
                ResultMessage::setMessage(__('The category could not be saved. Please, try again.'));
                ResultMessage::addValidationErrorsModel($category);
            }
        }
    }

    /**
     * Edit method
     *
     * @param string|null $id Category id.
     * @return void Redirects on successful edit, renders view otherwise.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function edit($id = null)
    {
        $category = $this->Categories->get($id, [
            'contain' => []
        ]);
        if ($this->request->is(['patch', 'post', 'put'])) {
            $category = $this->Categories->patchEntity($category, $this->request->data);
//            $fieldlist = [];
            if ($this->Categories->save($category)) {
                ResultMessage::setMessage(__('The category has been saved.'), true);
            } else {
                ResultMessage::setMessage(__('The category could not be saved. Please, try again.'));
                ResultMessage::addValidationErrorsModel($category);
            }
        }
    }

    /**
     * Delete method
     *
     * @param string|null $id Category id.
     * @return \Cake\Network\Response|null Redirects to index.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function delete($id = null)
    {
        $this->request->allowMethod(['post', 'delete']);
        $category = $this->Categories->get($id);
        if ($this->Categories->delete($category)) {
            ResultMessage::setMessage(__('The category has been deleted.'));
        } else {
            ResultMessage::setMessage(__('The category could not be deleted. Please, try again.'));
        }
        return $this->redirect(['action' => 'index']);
    }
}
